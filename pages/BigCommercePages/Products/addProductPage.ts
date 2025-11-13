import { Page, Locator, expect, FrameLocator } from '@playwright/test';
import { Homepage } from '../Dashboard/homepage';
import path from 'path';
import { TestCase } from '../../../utils/excelReader';

export class AddProductPage extends Homepage {
	private parentFrameLocatorFn: (page: Page) => FrameLocator;
	private tinyMCEFrameLocatorFn: (parentFrame: FrameLocator) => FrameLocator;
	private editableBodyLocatorFn: (tinyMCEFrame: FrameLocator) => Locator;
	private parentCategoryXpath: (parent: string) => string;
	private childCategoryXpath: (child: string) => string;
	private productNameInput: Locator;
	private skuInput: Locator;
	private defaultPriceInput: Locator;
	private productTypeDropdown: Locator;
	private brandDropdown: Locator;
	private weightInput: Locator;
	private visibleOnStorefrontCheckbox: Locator;
	private assignToChannelsButton: Locator;
	// Categories
	private categoriesSection: Locator;
	private categoryCheckboxes: Locator;
	// Description
	private descriptionFrameBody: Locator;
	private descriptionTextarea: Locator;
	// Product Identifiers
	private prodIdentifiers_sku: Locator;
	private mpnInput: Locator;
	private upcInput: Locator;
	private gtinInput: Locator;
	private bpnInput: Locator;
	// Pricing
	private defaultPriceInclTaxInput: Locator;
	private taxClassDropdown: Locator;
	private showAdvancedPricingLink: Locator;
	// Inventory
	private trackInventoryCheckbox: Locator;
	private editInventoryButton: Locator;
	// Variations & Customizations
	private addVariantOptionButton: Locator;
	// Storefront Details
	private featuredProductCheckbox: Locator;
	private searchKeywordsInput: Locator;
	private sortOrderInput: Locator;
	// ...existing code...
	private warrantyInfoInput: Locator;
	private availabilityTextInput: Locator;
	private conditionDropdown: Locator;
	private showConditionCheckbox: Locator;
	// Custom Fields
	// Related Products
	private showRelatedProductsCheckbox: Locator;
	// Fulfillment (Dimensions & Weight)
	private widthInput: Locator;
	private heightInput: Locator;
	private depthInput: Locator;
	// Shipping Details
	private fixedShippingPriceInput: Locator;
	private freeShippingCheckbox: Locator;
	// Purchasability
	private purchasabilityRadios: Locator;
	private minPurchaseQtyInput: Locator;
	private maxPurchaseQtyInput: Locator;
	// Gift Wrapping
	private giftWrappingRadios: Locator;
	// Customs Information
	private manageCustomsInfoCheckbox: Locator;
	// SEO
	private pageTitleInput: Locator;
	private productUrlInput: Locator;
	private metaDescriptionInput: Locator;
	// Open Graph Sharing
	private objectTypeDropdown: Locator;
	private useProductNameCheckbox: Locator;
	private useMetaDescriptionCheckbox: Locator;
	private useThumbnailImageRadio: Locator;
	private dontUseImageRadio: Locator;
	private addImageBtn: Locator;
	private addUploadBtn: Locator;
	private addFromUrlBtn: Locator;
	private fileInput: Locator;
	private costPriceInput: Locator;
	private msrpInput: Locator;
	private salePriceInput: Locator;
	private shippingWeightInput: Locator;
	private imageModalTitle: Locator;
	private imageThumbPreview: Locator;
	private enterUrlInput: Locator;
	private AddImageButton: any;
	private AssignandSaveBtn: Locator;
	private saveButtonClck: any;
	private searchInputbox: any;
	private productHeader: Locator;
	private addModifierOptionButton: Locator;
	private modifierModal: Locator;
	private modifierNameInput: (index: number) => Locator;
	private modifierTypeDropdown: (index: number) => Locator;
	private modifierTypeOption: (type: string) => Locator;
	private modifierValueInput: (index: number) => Locator;
	private requiredCheckbox: (index: number) => Locator;
	private addModifierConfirmButton: Locator;
	private addModifierButton: Locator;
	private searchInput: Locator;
	private productRows: Locator;
	private skuCellWithinRow: (row: Locator) => Locator;

	constructor(page: Page) {
		super(page);
		// Locator generator functions for fillDescription
		this.parentFrameLocatorFn = (page) => page.frameLocator('#content-iframe');
		this.tinyMCEFrameLocatorFn = (parentFrame) => parentFrame.frameLocator('iframe[title*="Rich Text Area"]');
		this.editableBodyLocatorFn = (tinyMCEFrame) => tinyMCEFrame.locator('body[contenteditable="true"]');
		const iframe = this.parentFrameLocatorFn(this.page);
		if (!iframe) throw new Error('Iframe not found. Ensure the iframe is loaded and accessible.');
		this.descriptionFrameBody = this.page.frameLocator("//iframe[@id='productInput-description']").locator("body");
		// Basic Info
		const initLocator = (xpath: string) => iframe.locator(xpath);
		this.productHeader = initLocator('//div[@class="appContainer"]//div[@class="addEdit-column-container panel-body"]')
		this.productNameInput = initLocator('//input[@id="productInput-name"]');
		this.skuInput = initLocator('//input[@id="productInput-sku"]');
		this.defaultPriceInput = initLocator('//input[@id="productInput-price"]');
		this.productTypeDropdown = initLocator('//input[@id="productInput-type"]');
		this.brandDropdown = initLocator('//input[@id="productInput-brand"]');
		this.weightInput = initLocator('//input[@id="productInput-weight"]');
		this.visibleOnStorefrontCheckbox = initLocator('//div[@id="add-edit-details"]//input[@type="checkbox"]');
		this.assignToChannelsButton = initLocator('//channel-toolbar//button/span[text()="Assign to channels"]');
		this.addUploadBtn = initLocator('//button[text()="Upload"]');
		this.fileInput = initLocator('//div[@aria-label="dropzone"]//input[@type="file"]');
		// Store XPath generator functions for categories
		this.parentCategoryXpath = (parent: string) => `xpath=//li[.//p[normalize-space(text())="${parent}"]]`;
		this.childCategoryXpath = (child: string) => `xpath=//li[.//p[normalize-space(text())="${child}"]]//input[@type="checkbox"]`;
		// Categories
		this.categoriesSection = initLocator('//div//p[contains(text(), "VueEcom - Sandbox 3")]');
		this.categoryCheckboxes = initLocator('//li[.//p[normalize-space(text())="All Products"]]//input[@type="checkbox"]');
		const iframe1 = this.page.frameLocator('//iframe[contains(@title,"Rich Text Area")]');
		const initLocator1 = (xpath: string) => iframe1.locator(xpath);
		// Description (WYSIWYG editor in iframe)
		this.descriptionTextarea = initLocator1('//textarea[@name="productInput-description"]');
		this.addImageBtn = initLocator('//button//span[text()="Add"]');
		this.addFromUrlBtn = initLocator('//div[contains(@class, "styled__StyledBox")]//button[normalize-space(text())="Add from URL"]'); // inside image modal
		this.enterUrlInput = initLocator('//input[@placeholder="https://www..."]'); // inside image modal
		this.AddImageButton = initLocator('//button//span[text()="Add image"]');
		this.AssignandSaveBtn = initLocator('//button//span[text()="Assign & Save"]');
		// We'll attempt multiple strategies; start with a generic page-level locator.
		this.fileInput = initLocator('input[type="file"]');   // hidden file input (global)
		this.imageModalTitle = initLocator('text=Add images to product');
		this.imageThumbPreview = initLocator('img[alt*="product"], img[alt*="thumbnail"], [data-test*="image-thumbnail"] img').first();
		// Product Identifiers
		this.prodIdentifiers_sku = initLocator('//input[@id="productInput-identifierSku"]');
		this.mpnInput = initLocator('//input[@id="productInput-mpn"]');
		this.upcInput = initLocator('//input[@id="productInput-upc"]');
		this.gtinInput = initLocator('//input[@id="productInput-gtin"]');
		this.bpnInput = initLocator('//input[@id="productInput-bpn"]');
		// Pricing
		this.defaultPriceInclTaxInput = initLocator('//input[@id="productInput-defaultPrice"]');
		this.taxClassDropdown = initLocator('//input[@id="productInput-tax_class_id"]');
		this.showAdvancedPricingLink = initLocator('//span[text()="Show Advanced Pricing"]');
		this.costPriceInput = initLocator('//input[@id="productInput-cost_price"]');
		this.msrpInput = initLocator('//input[@id="productInput-retail_price"]');
		this.salePriceInput = initLocator('//input[@id="productInput-sale_price"]');
		this.trackInventoryCheckbox = initLocator('label:has-text("Track inventory") input[type="checkbox"]');
		this.editInventoryButton = initLocator('button:has-text("Edit inventory")');
		this.addVariantOptionButton = initLocator('button:has-text("Add Variant Option")');
		this.featuredProductCheckbox = initLocator('label:has-text("Set as a Featured Product") input[type="checkbox"]');
		this.searchKeywordsInput = initLocator('//input[@id="productInput-search_keywords"]');
		this.sortOrderInput = initLocator('//input[@id="productInput-sort_order"]');
		this.warrantyInfoInput = initLocator('//textarea[@id="productInput-warranty"]');
		this.availabilityTextInput = initLocator('//input[@id="productInput-availability_text"]');
		this.conditionDropdown = initLocator('//input[@id="productInput-condition"]');
		this.showConditionCheckbox = iframe.locator('//label[@for="productInput-is_condition_shown"]');
		this.showRelatedProductsCheckbox = initLocator('label:has-text("Automatically show related products") input[type="checkbox"]');
		// Fulfillment (Dimensions & Weight)
		this.shippingWeightInput = initLocator('//input[@id="productInput-shippingWeight"]');
		this.widthInput = initLocator('//input[@id="productInput-width"]');
		this.heightInput = initLocator('//input[@id="productInput-height"]');
		this.depthInput = initLocator('//input[@id="productInput-depth"]');
		// Shipping Details
		this.fixedShippingPriceInput = initLocator('//input[@id="productInput-fixed_cost_shipping_price"]');
		this.freeShippingCheckbox = initLocator('label:has-text("Free Shipping") input[type="checkbox"]');
		// Purchasability
		this.purchasabilityRadios = initLocator('section:has-text("Purchasability") input[type="radio"]');
		this.minPurchaseQtyInput = initLocator('//input[@id="productInput-min_purchase_quantity"]');
		this.maxPurchaseQtyInput = initLocator('//input[@id="productInput-max_purchase_quantity"]');
		// Gift Wrapping
		this.giftWrappingRadios = initLocator('section:has-text("Gift Wrapping options") input[type="radio"]');
		// Customs Information
		this.manageCustomsInfoCheckbox = initLocator('label:has-text("Manage customs information") input[type="checkbox"]');
		// SEO
		this.searchInput = initLocator('//input[@placeholder="Search products"]');
		this.pageTitleInput = initLocator('//input[@id="productInput-page_title"]');
		this.productUrlInput = initLocator('//input[@id="productInput-custom_url"]');
		this.metaDescriptionInput = initLocator('//input[@id="productInput-meta_description"]');
		this.objectTypeDropdown = initLocator('//input[@id="productInput-facebook_type"]');
		this.useProductNameCheckbox = initLocator('label:has-text("Use product name") input[type="checkbox"]');
		this.useMetaDescriptionCheckbox = initLocator('label:has-text("Use meta description") input[type="checkbox"]');
		this.useThumbnailImageRadio = initLocator('label:has-text("Use thumbnail image") input[type="radio"]');
		this.dontUseImageRadio = initLocator('label:has-text("Don\'t use an image") input[type="radio"]');
		this.saveButtonClck = initLocator('//button[contains(@class,"main-button") and text()="Save"]');
		this.addModifierOptionButton = initLocator('//*[@id="add-edit-modifiers"]//button[@id="addEditOptions-add-modifiers"]');
		this.modifierModal = initLocator('//h3[contains(text(), "Modifier Options")]');
		this.addModifierButton = initLocator('//div[@class="table-actions-container"]//button[contains(@class,"addEditOptions-add-button") and contains(text(),"+ Add Modifier Option")]');
		this.productRows = iframe.locator('tbody tr, table tr');
		this.skuCellWithinRow = (row: Locator) => row.locator('td[data-testid="sku"] div');
		this.modifierNameInput = (index: number) =>
			initLocator(`(//label[normalize-space(span/text())="Name"]/following::input[contains(@id,"display_name")])[${index}]`);

		this.modifierTypeDropdown = (index: number) =>
			initLocator(`(//input[contains(@id, "modifier--") and contains(@id, "-type")])[${index}]`);

		this.modifierValueInput = (index: number) =>
			initLocator(`(//input[contains(@id,"default_value")])[${index}]`);

		this.requiredCheckbox = (index: number) =>
			initLocator(`(//label[span[normalize-space(text())="Required"]]/preceding-sibling::input[@type="checkbox"])[${index}]`);

		this.modifierTypeOption = (type: string) => initLocator(`//span[normalize-space(text())="${type}"]`);
		this.addModifierConfirmButton = initLocator('//button[@id="product-modifiers-submit"]');
	}

	getCategoryCheckbox(category: string): Locator {
		const iframe = this.page.frameLocator('#content-iframe');
		return iframe.locator(`//p[contains(normalize-space(.), "${category}")]`);
	}

	async fillBasicProductDetails(details: Record<string, any>) {
		try {
			await this.isElementVisible(this.productHeader);
			if (!(await this.productHeader.isVisible())) {
				throw new Error('Add Product page is not loaded properly.');
			}
			await this.enterText(this.productNameInput, String(details.productName ?? ''));
			await this.enterText(this.skuInput, String(details.sku ?? ''));
			await this.enterText(this.defaultPriceInput, String(details.defaultPrice ?? ''));
			await this.enterText(this.productTypeDropdown, String(details.productType ?? ''));
			await this.enterText(this.weightInput, String(details.weight ?? ''));
			if (details.visibleOnStorefront) {
				if (!(await this.visibleOnStorefrontCheckbox.isChecked())) {
					await this.visibleOnStorefrontCheckbox.click();
				}
			} else {
				if (await this.visibleOnStorefrontCheckbox.isChecked()) {
					await this.visibleOnStorefrontCheckbox.click();
				}
			}
			console.log('Selecting product categories...');
			const categoryMappings = buildCategoryMappings(details);
			await this.selectCategories(categoryMappings, this.parentCategoryXpath, this.childCategoryXpath);
			await this.fillDescription(String(details.description ?? ''));
			console.log('Clicking Add Image button...');
			await this.clickElement(this.addImageBtn, 'Add Image');
			console.log('Waiting for Upload button to be visible...');
			// Use your existing locator here
			const uploadBtn = this.addUploadBtn;
			await uploadBtn.waitFor({ state: 'visible' });

			console.log('Upload button is visible — skipping click to avoid file explorer.');

			// Directly target file input
			const fileInput = this.fileInput;
			await fileInput.waitFor({ state: 'attached' });

			console.log('Uploading file directly through hidden input...');
			const rawImagePath = details.imageFilePath || details['imageFilePath'];
			if (!rawImagePath) {
				throw new Error(`imageFilePath is missing in test data. Got: ${JSON.stringify(details)}`);
			}

			const imagePath = path.resolve(rawImagePath);
			await this.fileInput.setInputFiles(imagePath);

			console.log(' Image file uploaded successfully.');

			// Optionally confirm upload result (wait dynamically)
			//await expect(this.page.locator('text=jpeg')).toBeVisible();
			// const imagePath = 'C:/Big C automation/FinReconProj/comptia-itf-logo.jpeg';
			// const fileInput = await this.page.waitForSelector('input[type="file"]', { state: 'attached', timeout: 10000 });
			// await fileInput.setInputFiles(imagePath);

			//await this.clickElement(this.AddImageButton, 'Add Image');
			await this.clickElement(this.AssignandSaveBtn, 'Assign and Save');
		} catch (error) {
			console.error('Error filling basic product details:', error);
			throw error;
		}
	}

	async fillIdentifiers(details: Record<string, any>) {
		try {
			await this.enterText(this.prodIdentifiers_sku, String(details.sku ?? ''));
			await this.enterText(this.mpnInput, String(details.mpn ?? ''));
			await this.enterText(this.upcInput, String(details.upc ?? ''));
			await this.enterText(this.gtinInput, String(details.gtin ?? ''));
			await this.enterText(this.bpnInput, String(details.bpn ?? ''));
		} catch (error) {
			console.error('Error filling product identifiers:', error);
			throw error;
		}
	}

	async fillPricing(details: Record<string, any>) {
		try {
			await this.showAdvancedPricingLink.click();
			await this.enterText(this.costPriceInput, String(details.defaultPrice ?? ''));
			await this.enterText(this.msrpInput, String(details.defaultPrice ?? ''));
			await this.enterText(this.salePriceInput, String(details.defaultPrice ?? ''));
		} catch (error) {
			console.error('Error filling pricing details:', error);
			throw error;
		}
	}
	
	private prepareModifiersFromExcel(details: any): any[] {
		const modifiers: any[] = [];

		for (let i = 1; i <= 10; i++) { // adjust 10 if more modifier columns possible
			const name = details[`Modifier name ${i}`];
			const value = details[`Modifier Value ${i}`];
			const required = details[`is Modifier ${i} Required`];

			if (name && value) {
				modifiers.push({
					name: name.trim(),
					value: value.trim(),
					isRequired: required?.toLowerCase() === 'yes'
				});
			}
		}

		console.log('Prepared modifiers:', modifiers);
		return modifiers;
	}

	async fillModifiers(details: any) {
		const modifiers = this.prepareModifiersFromExcel(details);

		if (Array.isArray(modifiers) && modifiers.length > 0) {
			console.log(`Adding ${modifiers.length} modifiers for product.`);
			await this.addBundleModifiers(modifiers);
		} else {
			console.log('No valid modifiers found in Excel.');
		}
	}
	async fillAdditionalDetails(details: Record<string, any>) {
		try {
			await this.enterText(this.searchKeywordsInput, String(details.searchKeywords ?? ''));
			await this.enterText(this.sortOrderInput, String(details.sortOrder ?? ''));
			await this.enterText(this.warrantyInfoInput, String(details.warrantyInfo ?? ''));
			await this.enterText(this.availabilityTextInput, String(details.availabilityText ?? ''));
			await this.selectFromInputDropdownoverlay(this.conditionDropdown, String(details.condition ?? ''));
			if (details.visibleOnStorefront) {
				if (!(await this.showConditionCheckbox.isChecked())) {
					await this.clickElement(this.showConditionCheckbox, 'clicked the checkbox');
				}
			} else {
				if (await this.showConditionCheckbox.isChecked()) {
					await this.clickElement(this.showConditionCheckbox, 'clicked the checkbox');
				}
			}
			const width = details['dimensions.width'] ?? '';
			const height = details['dimensions.height'] ?? '';
			const depth = details['dimensions.depth'] ?? '';
			await this.enterText(this.widthInput, String(width));
			await this.enterText(this.heightInput, String(height));
			await this.enterText(this.depthInput, String(depth));
			await this.enterText(this.fixedShippingPriceInput, String(details.fixedShippingPrice ?? ''));
			await this.enterText(this.minPurchaseQtyInput, String(details.minPurchaseQty ?? ''));
			await this.enterText(this.maxPurchaseQtyInput, String(details.maxPurchaseQtyInput ?? ''));
			await this.selectGiftWrappingOptionDynamic(String(details.giftWrappingOption ?? ''));
			await this.enterText(this.metaDescriptionInput, String(details.metaDescription ?? ''));
			await this.clickElement(this.saveButtonClck, 'Product Saved');
		} catch (error) {
			console.error('Error filling additional product details:', error);
			throw error;
		}
	}
	
	async fillProduct(details: TestCase) {
		try {
			console.log(`Filling product: ${details.productName || '(Unnamed Product)'}`);
			const productType = String(details.productType ?? '').trim().toLowerCase();
			const testCaseName = String(details['Test Case Name'] ?? '').toLowerCase();

			await this.fillBasicProductDetails(details);
			await this.fillIdentifiers(details);
			await this.fillPricing(details);

			if (productType.includes('bundle') || testCaseName.includes('bundle')) {
				console.log('Detected Bundle Product — filling modifiers...');
				await this.fillModifiers(details);
			} else {
				console.log('Skipping modifiers — not a bundle product.');
			}

			await this.fillAdditionalDetails(details);

			console.log(`Product creation completed for: ${details.productName}`);
		} catch (error) {
			console.error('Error while filling product details:', error);
			throw error;
		}
	}

	async verifyProductExistsBySKU(sku: string) {
		if (!sku) throw new Error("SKU not provided");

		try {
			// Enter SKU and trigger search
			await this.searchInput.fill(sku);
			await this.searchInput.press('Enter');

			// Wait for the search to complete by waiting for at least one matching row in the refreshed DOM
			const iframe = this.page.frameLocator('#content-iframe');

			// Wait for table to reload – look for *any* visible SKU cell
			const firstSkuCell = iframe.locator('td[data-testid="sku"] div').first();
			await firstSkuCell.waitFor({ state: 'visible', timeout: 15000 });

			// Re-acquire the rows (fresh DOM)
			const rows = iframe.locator('tbody tr, table tr');
			const rowCount = await rows.count();
			console.log(`Found ${rowCount} rows for SKU search: ${sku}`);

			if (rowCount === 0) throw new Error(`No rows found after search for SKU: ${sku}`);

			let found = false;

			for (let i = 0; i < rowCount; i++) {
				const row = rows.nth(i);
				const skuCell = row.locator('td[data-testid="sku"] div');

				if (!(await skuCell.count())) {
					console.log(`Row ${i + 1}: no SKU cell`);
					continue;
				}

				const skuText = (await skuCell.textContent())?.trim() ?? '';
				console.log(`Row ${i + 1} SKU: ${skuText}`);

				if (skuText.replace(/\s+/g, '') === sku.replace(/\s+/g, '')) {
					console.log(`Product SKU matched UI: ${skuText}`);
					found = true;
					break;
				}
			}

			expect(found, `Product with SKU ${sku} should be present in table`).toBeTruthy();

		} catch (error) {
			console.error(`Error verifying product for SKU ${sku}:`, error);
			throw error;
		}
	}

	async addBundleModifiers(modifiers: any[]) {
		if (!modifiers?.length) return;

		console.log(`Adding ${modifiers.length} modifiers dynamically...`);

		await this.waitForElementToBeReady(this.addModifierOptionButton, "Add Modifier Button");
		//await this.scrollToElement(this.addModifierOptionButton);
		await this.clickElement(this.addModifierOptionButton, "Clicked the add modifier option button");

		for (const [index, mod] of modifiers.entries()) {
			const modIndex = index + 1; // XPath index starts at 1
			const { name, type, value, required } = mod;

			console.log(`Adding Modifier #${modIndex}:`, mod);

			try {
				await this.clickElement(this.addModifierButton, "Clicked the Add Modifier button");

				const nameInput = this.modifierNameInput(modIndex);
				await this.enterText(nameInput, name);

				const valueInput = this.modifierValueInput(modIndex);
				if (await valueInput.isVisible()) {
					await valueInput.evaluate((el: HTMLInputElement, val: string) => el.value = val, value);
				}

				const checkbox = this.requiredCheckbox(modIndex);
				await checkbox.evaluate((el: HTMLInputElement, val: boolean) => {
					el.checked = val;
					el.dispatchEvent(new Event('change', { bubbles: true }));
				}, required);


			} catch (err) {
				console.error(`Failed to add modifier "${name}":`, err);
			}
		}
		await this.addModifierConfirmButton.click();
		await this.page.waitForTimeout(800);
		console.log(`Modifier added`);
	}

	async selectFromInputDropdownoverlay(
		inputLocator: Locator,
		optionText: string,
		timeout: number = 10000
	) {

		await inputLocator.waitFor({ state: 'visible', timeout });
		await inputLocator.click();
		await inputLocator.fill(optionText);


		const listbox = inputLocator.locator('xpath=ancestor::custom-dropdown//ul[@role="listbox"]');
		await listbox.waitFor({ state: 'visible', timeout });

		const option = listbox.locator(`li:has-text("${optionText}")`).first();
		await option.scrollIntoViewIfNeeded();
		await option.click();
	}

	async selectGiftWrappingOptionDynamic(optionText: string): Promise<void> {
		const iframe = this.page.frameLocator('#content-iframe');
		const option = optionText.trim().toLowerCase();

		const optionMap: Record<string, string> = {
			any: '#productInput-gift_wrapping_all',
			none: '#productInput-gift_wrapping_any',
			list: '#productInput-gift_wrapping_custom'
		};

		const selector = optionMap[option];
		if (!selector) throw new Error(` Invalid gift wrapping option: "${optionText}"`);

		const radio = iframe.locator(selector);

		await radio.waitFor({ state: 'attached', timeout: 5000 });


		if (await radio.isDisabled()) {
			console.warn(` Option "${option}" is disabled, skipping selection.`);
			return;
		}

		if (!(await radio.isChecked())) {
			await radio.click({ force: true });
			console.log(` Selected gift wrapping option: "${option}"`);
		} else {
			console.log(` Option "${option}" already selected.`);
		}
	}

	async selectCategories(
		categoryMappings: { parent: string; children: string[] }[],
		parentXpathFn: (parent: string) => string,
		childXpathFn: (child: string) => string
	) {
		if (!categoryMappings || categoryMappings.length === 0) return;

		const iframe = this.page.frameLocator('#content-iframe');

		for (const { parent, children } of categoryMappings) {
			const parentNode = iframe.locator(parentXpathFn(parent));
			if ((await parentNode.count()) === 0) {
				console.warn(`Parent category "${parent}" not found`);
				continue;
			}

			await parentNode.click({ timeout: 5000 });
			console.log(`Expanded parent category: ${parent}`);

			for (const child of children) {
				const childInput = iframe.locator(childXpathFn(child));
				const count = await childInput.count();
				if (count === 0) {
					console.warn(`Child category "${child}" not found under "${parent}"`);
					continue;
				}

				const inputId = await childInput.getAttribute('id');
				if (!inputId) {
					console.warn(`Checkbox for "${child}" has no id`);
					continue;
				}

				const label = iframe.locator(`label[for="${inputId}"]`);
				await label.waitFor({ state: 'visible', timeout: 10000 });

				const isChecked = await childInput.isChecked();
				if (!isChecked) {
					await label.click();
					await this.page.waitForTimeout(100);
					console.log(`Checked child category: ${child} (under ${parent})`);
				} else {
					console.log(`Child category already checked: ${child}`);
				}
			}
		}
	}

	async fillDescription(description: string) {
		const parentFrame = this.parentFrameLocatorFn(this.page);
		const tinyMCEFrame = this.tinyMCEFrameLocatorFn(parentFrame);
		const editableBody = this.editableBodyLocatorFn(tinyMCEFrame);
		await editableBody.waitFor({ state: 'visible', timeout: 10000 });
		await editableBody.fill(description);
	}

}

function buildCategoryMappings(details: Record<string, any>) {
	const parentCategories = String(details.categories ?? '')
		.split(',')
		.map(c => c.trim())
		.filter(c => c.length > 0);

	const subCategories = String(details['sub category'] ?? '')
		.split(/[,.]/)
		.map(c => c.trim())
		.filter(c => c.length > 0);

	const mappings: { parent: string; children: string[] }[] = [];

	if (parentCategories.length > 1 && subCategories.length > 0) {
		const chunkSize = Math.ceil(subCategories.length / parentCategories.length);
		for (let i = 0; i < parentCategories.length; i++) {
			const children = subCategories.slice(i * chunkSize, (i + 1) * chunkSize);
			mappings.push({ parent: parentCategories[i], children });
		}
	} else {
		for (const parent of parentCategories) {
			mappings.push({ parent, children: subCategories });
		}
	}

	return mappings;
}
