import { FrameLocator, Locator, Page } from '@playwright/test';

/**
 * UI Interactions utility class for handling common tricky UI interactions
 * with built-in fallback mechanisms for more reliable test automation
 */
export class UIInteractions {
    /**
     * Robust method to check a checkbox or radio button with multiple fallback approaches
     * @param locator - The Playwright locator for the checkbox/radio
     * @param options - Optional configuration options
     * @returns Promise<boolean> - True if successful, false otherwise
     */
    static async checkElement(
        locator: Locator,
        options: {
            timeout?: number;
            description?: string;
            page?: Page;
            iframe?: string;
        } = {}
    ): Promise<boolean> {
        const description = options.description || 'element';
        const timeout = options.timeout || 5000;
        
        try {
            // Approach 1: Standard check with force
            try {
                await locator.waitFor({ state: 'visible', timeout });
                await locator.check({ force: true, timeout });
                console.log(`Successfully checked ${description} using standard approach`);
                return true;
            } catch (error) {
                console.log(`Standard check failed for ${description}, trying alternative approaches...`);
            }

            // Approach 2: Click instead of check
            try {
                await locator.click({ force: true, timeout });
                console.log(`Successfully clicked ${description} as alternative to check`);
                return true;
            } catch (clickError) {
                console.log(`Click approach failed for ${description}`);
            }

            // Approach 3: JavaScript execution in the main document
            try {
                await locator.evaluate((element: HTMLElement) => {
                    if (element.tagName === 'INPUT') {
                        const inputElement = element as HTMLInputElement;
                        if (inputElement.type === 'checkbox' || inputElement.type === 'radio') {
                            inputElement.checked = true;
                            element.dispatchEvent(new Event('change', { bubbles: true }));
                            element.dispatchEvent(new Event('input', { bubbles: true }));
                            element.dispatchEvent(new Event('click', { bubbles: true }));
                        } else {
                            element.click();
                        }
                        return true;
                    } else {
                        element.click();
                        return true;
                    }
                    return false;
                });
                console.log(`Successfully used JS to check ${description}`);
                return true;
            } catch (jsError) {
                console.log(`JS execution approach failed for ${description}`);
            }

            // Approach 4: If we have page and iframe information, try within iframe
            if (options.page && options.iframe) {
                try {
                    const frame = options.page.frame(options.iframe);
                    if (frame) {
                        // We need to reconstruct the selector for the frame context
                        // This is a bit complex and depends on how your locator was created
                        const selector = await locator.evaluate((el: Element) => {
                            let path = '';
                            let currentElement: Element | null = el;
                            while (currentElement && currentElement !== document.documentElement) {
                                const tagName = currentElement.tagName.toLowerCase();
                                let index = 0;
                                let sibling: Element | null = currentElement;
                                while (sibling.previousElementSibling) {
                                    sibling = sibling.previousElementSibling;
                                    if (sibling && sibling.tagName.toLowerCase() === tagName) {
                                        index++;
                                    }
                                }
                                path = `${tagName}${index > 0 ? `:nth-of-type(${index + 1})` : ''}${path ? ' > ' + path : ''}`;
                                currentElement = currentElement.parentElement;
                            }
                            return path;
                        }).catch(() => null);
                        
                        if (selector) {
                            await frame.evaluate((selector: string) => {
                                const element = document.querySelector(selector);
                                if (element && element instanceof HTMLInputElement && 
                                   (element.type === 'checkbox' || element.type === 'radio')) {
                                    element.checked = true;
                                    element.dispatchEvent(new Event('change', { bubbles: true }));
                                    return true;
                                }
                                return false;
                            }, selector);
                            console.log(`Successfully used iframe JS approach for ${description}`);
                            return true;
                        }
                    }
                } catch (frameError) {
                    console.log(`Iframe JS approach failed for ${description}`);
                }
            }

            console.log(`All approaches failed for checking ${description}`);
            return false;
        } catch (error) {
            console.error(`Error in checkElement for ${description}:`, error);
            return false;
        }
    }

    /**
     * Robust method to uncheck a checkbox with multiple fallback approaches
     * @param locator - The Playwright locator for the checkbox
     * @param options - Optional configuration options
     * @returns Promise<boolean> - True if successful, false otherwise
     */
    static async uncheckElement(
        locator: Locator,
        options: {
            timeout?: number;
            description?: string;
        } = {}
    ): Promise<boolean> {
        const description = options.description || 'element';
        const timeout = options.timeout || 5000;
        
        try {
            // Approach 1: Standard uncheck with force
            try {
                await locator.waitFor({ state: 'visible', timeout });
                await locator.uncheck({ force: true, timeout });
                console.log(`Successfully unchecked ${description} using standard approach`);
                return true;
            } catch (error) {
                console.log(`Standard uncheck failed for ${description}, trying alternative approaches...`);
            }

            // Approach 2: Click instead of uncheck (will toggle)
            try {
                await locator.click({ force: true, timeout });
                console.log(`Successfully clicked ${description} as alternative to uncheck`);
                return true;
            } catch (clickError) {
                console.log(`Click approach failed for ${description}`);
            }

            // Approach 3: JavaScript execution
            try {
                await locator.evaluate((element: HTMLElement) => {
                    if (element.tagName === 'INPUT') {
                        const inputElement = element as HTMLInputElement;
                        if (inputElement.type === 'checkbox') {
                            inputElement.checked = false;
                            element.dispatchEvent(new Event('change', { bubbles: true }));
                            element.dispatchEvent(new Event('input', { bubbles: true }));
                            return true;
                        }
                    }
                    return false;
                });
                console.log(`Successfully used JS to uncheck ${description}`);
                return true;
            } catch (jsError) {
                console.log(`JS execution approach failed for ${description}`);
            }

            console.log(`All approaches failed for unchecking ${description}`);
            return false;
        } catch (error) {
            console.error(`Error in uncheckElement for ${description}:`, error);
            return false;
        }
    }

    /**
     * Robust method to fill an input field with multiple fallback approaches
     * @param locator - The Playwright locator for the input
     * @param value - The value to fill
     * @param options - Optional configuration options
     * @returns Promise<boolean> - True if successful, false otherwise
     */
    static async fillInput(
        locator: Locator,
        value: string,
        options: {
            timeout?: number;
            description?: string;
            clearFirst?: boolean;
        } = {}
    ): Promise<boolean> {
        const description = options.description || 'input field';
        const timeout = options.timeout || 5000;
        const clearFirst = options.clearFirst !== undefined ? options.clearFirst : true;
        
        try {
            // Approach 1: Standard fill
            try {
                await locator.waitFor({ state: 'visible', timeout });
                if (clearFirst) {
                    await locator.clear({ timeout });
                }
                await locator.fill(value, { timeout });
                console.log(`Successfully filled ${description} using standard approach`);
                return true;
            } catch (error) {
                console.log(`Standard fill failed for ${description}, trying alternative approaches...`);
            }

            // Approach 2: Type instead of fill
            try {
                if (clearFirst) {
                    await locator.clear({ timeout });
                }
                await locator.type(value, { timeout });
                console.log(`Successfully typed into ${description} as alternative to fill`);
                return true;
            } catch (typeError) {
                console.log(`Type approach failed for ${description}`);
            }

            // Approach 3: JavaScript execution
            try {
                await locator.evaluate((element: HTMLElement, val: string) => {
                    if (element instanceof HTMLInputElement || 
                        element instanceof HTMLTextAreaElement || 
                        element instanceof HTMLSelectElement) {
                        element.value = val;
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        element.dispatchEvent(new Event('change', { bubbles: true }));
                        return true;
                    }
                    return false;
                }, value);
                console.log(`Successfully used JS to fill ${description}`);
                return true;
            } catch (jsError) {
                console.log(`JS execution approach failed for ${description}`);
            }

            console.log(`All approaches failed for filling ${description}`);
            return false;
        } catch (error) {
            console.error(`Error in fillInput for ${description}:`, error);
            return false;
        }
    }

    /**
     * Robust method to select an option from a dropdown with multiple fallback approaches
     * @param locator - The Playwright locator for the select element
     * @param optionValue - The value or label of the option to select
     * @param options - Optional configuration options
     * @returns Promise<boolean> - True if successful, false otherwise
     */
    static async selectOption(
        locator: Locator,
        optionValue: string,
        options: {
            timeout?: number;
            description?: string;
            byValue?: boolean; // true to select by value, false to select by label
        } = {}
    ): Promise<boolean> {
        const description = options.description || 'dropdown';
        const timeout = options.timeout || 5000;
        const byValue = options.byValue !== undefined ? options.byValue : true;
        
        try {
            // Approach 1: Standard selectOption
            try {
                await locator.waitFor({ state: 'visible', timeout });
                if (byValue) {
                    await locator.selectOption({ value: optionValue }, { timeout });
                } else {
                    await locator.selectOption({ label: optionValue }, { timeout });
                }
                console.log(`Successfully selected option in ${description} using standard approach`);
                return true;
            } catch (error) {
                console.log(`Standard select failed for ${description}, trying alternative approaches...`);
            }

            // Approach 2: JavaScript execution
            try {
                // Pass in parameters as a single object to work around TypeScript evaluation limitations
                const params = { value: optionValue, byValue };
                await locator.evaluate((element: HTMLElement, params: { value: string, byValue: boolean }) => {
                    if (element instanceof HTMLSelectElement) {
                        const options = Array.from(element.options);
                        if (params.byValue) {
                            // Select by value
                            const option = options.find(opt => opt.value === params.value);
                            if (option) {
                                element.value = option.value;
                                element.dispatchEvent(new Event('change', { bubbles: true }));
                                return true;
                            }
                        } else {
                            // Select by text
                            const option = options.find(opt => opt.text === params.value);
                            if (option) {
                                element.value = option.value;
                                element.dispatchEvent(new Event('change', { bubbles: true }));
                                return true;
                            }
                        }
                    }
                    return false;
                }, params);
                console.log(`Successfully used JS to select option in ${description}`);
                return true;
            } catch (jsError) {
                console.log(`JS execution approach failed for ${description}`);
            }

            console.log(`All approaches failed for selecting option in ${description}`);
            return false;
        } catch (error) {
            console.error(`Error in selectOption for ${description}:`, error);
            return false;
        }
    }
}