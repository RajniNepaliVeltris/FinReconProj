import { Page, Locator, expect } from '@playwright/test';
import { Homepage } from '../Dashboard/homepage';
import { ProductData } from './productType';
import path from 'path';
import * as fs from 'fs';

export class AddProductPage extends Homepage {
	// Fill all product details from ProductData
		// Basic Info
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
		private addModifierOptionButton: Locator;
		// Storefront Details
		private featuredProductCheckbox: Locator;
		private searchKeywordsInput: Locator;
		private sortOrderInput: Locator;
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

		constructor(page: Page) {
			 super(page);
        	const iframe = this.page.frameLocator('#content-iframe');
        	if (!iframe) throw new Error('Iframe not found. Ensure the iframe is loaded and accessible.');
			this.descriptionFrameBody = this.page.frameLocator("//iframe[@id='productInput-description']").locator("body");
			// Basic Info
			const initLocator = (xpath: string) => iframe.locator(xpath);
			this.productNameInput = initLocator('//input[@id="productInput-name"]');
			this.skuInput = initLocator('//input[@id="productInput-sku"]');
			this.defaultPriceInput = initLocator('//input[@id="productInput-price"]');
			this.productTypeDropdown = initLocator('//input[@id="productInput-type"]');
			this.brandDropdown = initLocator('//input[@id="productInput-brand"]');
			this.weightInput = initLocator('//input[@id="productInput-weight"]');
			this.visibleOnStorefrontCheckbox = initLocator('//div[@id="add-edit-details"]//input[@type="checkbox"]');
			this.assignToChannelsButton = initLocator('//channel-toolbar//button/span[text()="Assign to channels"]');
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
			// Inventory
			this.trackInventoryCheckbox = initLocator('label:has-text("Track inventory") input[type="checkbox"]');
			this.editInventoryButton = initLocator('button:has-text("Edit inventory")');
			// Variations & Customizations
			this.addVariantOptionButton = initLocator('button:has-text("Add Variant Option")');
			this.addModifierOptionButton = initLocator('button:has-text("Add Modifier Option")');
			// Storefront Details
			this.featuredProductCheckbox = initLocator('label:has-text("Set as a Featured Product") input[type="checkbox"]');
			this.searchKeywordsInput = initLocator('//input[@id="productInput-search_keywords"]');
			this.sortOrderInput = initLocator('//input[@id="productInput-sort_order"]');
			this.warrantyInfoInput = initLocator('//textarea[@id="productInput-warranty"]');
			this.availabilityTextInput = initLocator('//input[@id="productInput-availability_text"]');
			this.conditionDropdown = initLocator('//input[@id="productInput-condition"]');
			this.showConditionCheckbox = iframe.locator('//label[@for="productInput-is_condition_shown"]');
			// Custom Fields
			// Related Products
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
			this.pageTitleInput = initLocator('//input[@id="productInput-page_title"]');
			this.productUrlInput = initLocator('//input[@id="productInput-custom_url"]');
			this.metaDescriptionInput = initLocator('//input[@id="productInput-meta_description"]');
			// Open Graph Sharing
			this.objectTypeDropdown = initLocator('//input[@id="productInput-facebook_type"]');
			this.useProductNameCheckbox = initLocator('label:has-text("Use product name") input[type="checkbox"]');
			this.useMetaDescriptionCheckbox = initLocator('label:has-text("Use meta description") input[type="checkbox"]');
			this.useThumbnailImageRadio = initLocator('label:has-text("Use thumbnail image") input[type="radio"]');
			this.dontUseImageRadio = initLocator('label:has-text("Don\'t use an image") input[type="radio"]');
			this.saveButtonClck = initLocator('//button[contains(@class,"main-button") and text()="Save"]');
			}
		
			getCategoryCheckbox(category: string): Locator {
				const iframe = this.page.frameLocator('#content-iframe');
				return iframe.locator(`//p[contains(normalize-space(.), "${category}")]`);
			}
async fillProductDetails(product: ProductData) {
	try { 
	await this.enterText (this.productNameInput, product.productName);
	await this.enterText (this.skuInput, product.sku);
	await this.enterText (this.defaultPriceInput, product.defaultPrice);
	await this.enterText (this.productTypeDropdown, product.productType);
	//await this.enterText (this.brandDropdown, product.brand);
	await this.enterText (this.weightInput, product.weight);
	if (product.visibleOnStorefront) {
		if (!(await this.visibleOnStorefrontCheckbox.isChecked())) {
			await this.visibleOnStorefrontCheckbox.click();
		}
	} else {
		if (await this.visibleOnStorefrontCheckbox.isChecked()) {
			await this.visibleOnStorefrontCheckbox.click();
		}
	}

	// Usage inside your loop
	await this.selectCategories([product.categories]);
	await this.fillDescription(product.description);
	//await this.enterText(this.descriptionTextarea, product.description);
	await this.clickElement(this.addImageBtn,"Add Image");
	await this.clickElement(this.addFromUrlBtn,"Add from URL");
	await this.enterText(this.enterUrlInput, product.imageUrl || "");
	await this.clickElement(this.AddImageButton,"Add Image");
	await this.clickElement(this.AssignandSaveBtn,"Assign and Save");
		// await this.descriptionFrameBody.fill(product.description);
	

		await this.enterText(this.prodIdentifiers_sku, product.sku);
		await this.enterText(this.mpnInput, product.mpn);
		await this.enterText(this.upcInput, product.upc);
		await this.enterText(this.gtinInput, product.gtin);
		await this.enterText(this.bpnInput, product.bpn);
		await this.enterText(this.defaultPriceInclTaxInput, product.defaultPrice);
		//await this.selectFromInputDropdownDynamic(this.taxClassDropdown, product.taxClass);
		await this.showAdvancedPricingLink.click();
		await this.enterText(this.costPriceInput, product.defaultPrice);
		await this.enterText(this.msrpInput, product.defaultPrice);
		await this.enterText(this.salePriceInput, product.defaultPrice);
		await this.enterText(this.searchKeywordsInput, product.searchKeywords);
		await this.enterText(this.sortOrderInput, product.sortOrder);
		await this.enterText(this.warrantyInfoInput, product.warrantyInfo);
		await this.enterText(this.availabilityTextInput, product.availabilityText);
		await this.selectFromInputDropdownoverlay(this.conditionDropdown, product.condition); // ensure checkbox is rendered
		if (product.visibleOnStorefront) {
		if (!(await this.showConditionCheckbox.isChecked())) {
			await this.clickElement(this.showConditionCheckbox,"clicked the checkbox ");
		}
	} else {
		if (await this.showConditionCheckbox.isChecked()) {
			await this.clickElement(this.showConditionCheckbox,"clicked the checkbox ");
		}
	}
		await this.enterText(this.widthInput, product.dimensions.width);
		await this.enterText(this.heightInput, product.dimensions.height);
		await this.enterText(this.depthInput, product.dimensions.depth);
		await this.enterText(this.fixedShippingPriceInput, product.fixedShippingPrice);
		await this.enterText(this.minPurchaseQtyInput, product.minPurchaseQty);
		await this.enterText(this.maxPurchaseQtyInput, product.maxPurchaseQty);
		await this.selectGiftWrappingOptionDynamic(product.giftWrappingOption);
		await this.enterText(this.metaDescriptionInput, product.metaDescription);
		await this.clickElement(this.saveButtonClck,"Product Saved");
	} catch (error) {
		console.error('Error filling product details:', error);
		throw error;	
	}
}
async verifyProductExistsBySKU(sku: string) {
    if (!sku) {
        console.error("Error: SKU not provided. Did you create the product first?");
        throw new Error("SKU not provided");
    }

    try {
        await this.page.goto('https://your-site.com/admin/products'); // replace with actual URL
        await this.page.waitForLoadState('networkidle');

        const iframe = this.page.frameLocator('#content-iframe');

        const searchInput = iframe.locator('//input[@placeholder="Search products"]');
        await searchInput.waitFor({ state: 'visible', timeout: 10000 });
        await searchInput.fill(sku);

        await searchInput.press('Enter');
        await this.page.waitForTimeout(2000); // wait for results to appear

        // Locate all rows
        const rowsLocator = iframe.locator('tr'); // adjust selector if needed
        await expect(rowsLocator.first()).toBeVisible({ timeout: 10000 });

        const rowCount = await rowsLocator.count();
        console.log(`Found ${rowCount} rows for SKU search: ${sku}`);

        let found = false;
        for (let i = 0; i < rowCount; i++) {
            const skuCell = rowsLocator.nth(i).locator('td:nth-child(2)'); // adjust column index for SKU
            const skuText = (await skuCell.textContent())?.trim();
            console.log(`Row ${i + 1} SKU: ${skuText}`);
            if (skuText === sku) {
                console.log(`Product SKU matched UI: ${skuText}`);
                found = true;
                break;
            }
        }
        expect(found).toBeTruthy();

    } catch (error) {
        console.error(`Error verifying product for SKU ${sku}:`, error);
        throw error;
    }
}
}
