import * as fs from 'fs';
import * as path from 'path';
import { getBigCConnection } from './db';

export class QueryManager {
    private static instance: QueryManager;
    private queries: Map<string, string> = new Map();

    private constructor() {
        this.loadQueries();
    }

    public static getInstance(): QueryManager {
        if (!QueryManager.instance) {
            QueryManager.instance = new QueryManager();
        }
        return QueryManager.instance;
    }

    private loadQueries(): void {
        // Try multiple possible locations for the queries directory
        const possiblePaths = [
            path.join(__dirname, '../queries'),        // dist/utils -> queries
            path.join(__dirname, '../../queries'),     // dist/utils -> src/queries
            path.join(process.cwd(), 'queries'),       // project root/queries
            path.join(process.cwd(), 'src/queries'),   // project root/src/queries
        ];

        let queriesDir = '';
        for (const testPath of possiblePaths) {
            if (fs.existsSync(testPath)) {
                queriesDir = testPath;
                break;
            }
        }

        if (!queriesDir) {
            console.error('Could not find queries directory. Searched paths:', possiblePaths);
            return;
        }

        console.log('Loading queries from:', queriesDir);

        try {
            const files = fs.readdirSync(queriesDir);

            for (const file of files) {
                if (file.endsWith('.sql')) {
                    const filePath = path.join(queriesDir, file);
                    const content = fs.readFileSync(filePath, 'utf-8');

                    // Split queries by comments and extract named queries
                    const queryBlocks = this.parseQueryBlocks(content);
                    queryBlocks.forEach((query, name) => {
                        this.queries.set(name, query);
                    });
                }
            }

            console.log(`Loaded ${this.queries.size} queries from ${queriesDir}`);
        } catch (error) {
            console.error('Error loading queries:', error);
        }
    }

    private parseQueryBlocks(content: string): Map<string, string> {
        const queries = new Map<string, string>();
        const lines = content.split('\n');
        let currentQuery = '';
        let currentName = '';
        let inQuery = false;

        for (const line of lines) {
            const trimmed = line.trim();

            // Check for query start markers
            if (trimmed.startsWith('--') && trimmed.includes('Query')) {
                // Save previous query if exists
                if (currentName && currentQuery) {
                    queries.set(currentName, currentQuery.trim());
                }

                // Extract query name
                const nameMatch = trimmed.match(/--\s*(.+?)\s*Query/);
                if (nameMatch) {
                    currentName = nameMatch[1].toLowerCase().replace(/\s+/g, '-');
                    currentQuery = '';
                    inQuery = true;
                }
            } else if (inQuery && !trimmed.startsWith('--') && trimmed !== '') {
                // Add to current query
                currentQuery += line + '\n';
            } else if (trimmed === '' && inQuery) {
                // End of query block
                if (currentName && currentQuery) {
                    queries.set(currentName, currentQuery.trim());
                    currentName = '';
                    currentQuery = '';
                    inQuery = false;
                }
            }
        }

        // Save last query
        if (currentName && currentQuery) {
            queries.set(currentName, currentQuery.trim());
        }

        return queries;
    }

    public getQuery(name: string): string | undefined {
        return this.queries.get(name);
    }

    public async executeQuery(queryName: string, params: any = {}): Promise<any[]> {
        const query = this.getQuery(queryName);

        if (!query) {
            throw new Error(`Query '${queryName}' not found`);
        }

        console.log(`Executing query: ${queryName}`);

        const connection = await getBigCConnection();
        const request = connection.request();

        // Add parameters to the request
        Object.keys(params).forEach(key => {
            request.input(key, params[key]);
        });

        const result = await request.query(query);
        return result.recordset;
    }

    public listQueries(): string[] {
        return Array.from(this.queries.keys());
    }
}