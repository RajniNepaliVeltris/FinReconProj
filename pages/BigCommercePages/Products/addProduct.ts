import { Page, Locator } from '@playwright/test';

export class AddProductPage {

		readonly page: Page;
		// Basic Info
		readonly productNameInput: Locator;
		readonly skuInput: Locator;
		readonly defaultPriceInput: Locator;
		readonly productTypeDropdown: Locator;
		readonly brandDropdown: Locator;
		readonly weightInput: Locator;
		readonly visibleOnStorefrontCheckbox: Locator;
		readonly assignToChannelsButton: Locator;
		// Categories
		readonly categoriesSection: Locator;
		readonly categoryCheckboxes: Locator;
		// Description
        readonly descriptionTextarea: Locator;
		// Product Identifiers
        readonly prodIdentifiers_sku: Locator;
		readonly mpnInput: Locator;
		readonly upcInput: Locator;
		readonly gtinInput: Locator;
		readonly bpnInput: Locator;
		// Pricing
        readonly defaultPriceInclTaxInput: Locator;
		readonly taxClassDropdown: Locator;
		readonly showAdvancedPricingLink: Locator;
		// Inventory
		readonly trackInventoryCheckbox: Locator;
		readonly editInventoryButton: Locator;
		// Variations & Customizations
		readonly addVariantOptionButton: Locator;
		readonly addModifierOptionButton: Locator;
		// Storefront Details
		readonly featuredProductCheckbox: Locator;
		readonly searchKeywordsInput: Locator;
		readonly sortOrderInput: Locator;
		readonly warrantyInfoInput: Locator;
		readonly availabilityTextInput: Locator;
		readonly conditionDropdown: Locator;
		readonly showConditionCheckbox: Locator;
		// Custom Fields
		readonly addCustomFieldsButton: Locator;
		// Related Products
		readonly showRelatedProductsCheckbox: Locator;
		// Fulfillment (Dimensions & Weight)
		readonly widthInput: Locator;
		readonly heightInput: Locator;
		readonly depthInput: Locator;
		// Shipping Details
		readonly fixedShippingPriceInput: Locator;
		readonly freeShippingCheckbox: Locator;
		// Purchasability
		readonly purchasabilityRadios: Locator;
		readonly minPurchaseQtyInput: Locator;
		readonly maxPurchaseQtyInput: Locator;
		// Gift Wrapping
		readonly giftWrappingRadios: Locator;
		// Customs Information
		readonly manageCustomsInfoCheckbox: Locator;
		// SEO
		readonly pageTitleInput: Locator;
		readonly productUrlInput: Locator;
		readonly metaDescriptionInput: Locator;
		// Open Graph Sharing
		readonly objectTypeDropdown: Locator;
		readonly useProductNameCheckbox: Locator;
		readonly useMetaDescriptionCheckbox: Locator;
		readonly useThumbnailImageRadio: Locator;
		readonly dontUseImageRadio: Locator;

		constructor(page: Page) {
			this.page = page;
			// Basic Info
			this.productNameInput = page.locator('input[id="productInput-name"]');
			this.skuInput = page.locator('input[id="productInput-sku"]');
			this.defaultPriceInput = page.locator('input[id="productInput-price"]');
			this.productTypeDropdown = page.locator('input[id="productInput-type"]');
			this.brandDropdown = page.locator('input[id="productInput-brand"]');
			this.weightInput = page.locator('input[id="productInput-weight"]');
			this.visibleOnStorefrontCheckbox = page.locator('//div[@id="add-edit-details"]//input[@type="checkbox"]');
			this.assignToChannelsButton = page.locator('//channel-toolbar//button/span[text()="Assign to channels"]');
			// Categories
			this.categoriesSection = page.locator('text=Categories');
			this.categoryCheckboxes = page.locator('section:has-text("Categories") input[type="checkbox"]');
			// Description (WYSIWYG editor in iframe)
			this.descriptionTextarea = page.locator('//textarea[@name="productInput-description"]');
			// Product Identifiers
			this.prodIdentifiers_sku = page.locator('input[id="productInput-identifierSku"]');
            this.mpnInput = page.locator('input[id="productInput-mpn"]');
			this.upcInput = page.locator('input[id="productInput-upc"]');
			this.gtinInput = page.locator('input[id="productInput-gtin"]');
			this.bpnInput = page.locator('input[id="productInput-bpn"]');
			// Pricing
			this.defaultPriceInclTaxInput = page.locator('input[id="productInput-defaultPrice"]');
			this.taxClassDropdown = page.locator('input[id="productInput-tax_class_id"]');
			this.showAdvancedPricingLink = page.locator('a:has-text("Show Advanced Pricing")');
			// Inventory
			this.trackInventoryCheckbox = page.locator('label:has-text("Track inventory") input[type="checkbox"]');
			this.editInventoryButton = page.locator('button:has-text("Edit inventory")');
			// Variations & Customizations
			this.addVariantOptionButton = page.locator('button:has-text("Add Variant Option")');
			this.addModifierOptionButton = page.locator('button:has-text("Add Modifier Option")');
			// Storefront Details
			this.featuredProductCheckbox = page.locator('label:has-text("Set as a Featured Product") input[type="checkbox"]');
			this.searchKeywordsInput = page.locator('input[placeholder*="Search Keywords"]');
			this.sortOrderInput = page.locator('input[placeholder*="Sort Order"]');
			this.warrantyInfoInput = page.locator('textarea[placeholder*="Warranty Information"]');
			this.availabilityTextInput = page.locator('input[placeholder*="Availability Text"]');
			this.conditionDropdown = page.locator('select[aria-label="Condition"]');
			this.showConditionCheckbox = page.locator('label:has-text("Show condition on storefront") input[type="checkbox"]');
			// Custom Fields
			this.addCustomFieldsButton = page.locator('button:has-text("Add Custom Fields")');
			// Related Products
			this.showRelatedProductsCheckbox = page.locator('label:has-text("Automatically show related products") input[type="checkbox"]');
			// Fulfillment (Dimensions & Weight)
			this.widthInput = page.locator('input[placeholder*="Width"]');
			this.heightInput = page.locator('input[placeholder*="Height"]');
			this.depthInput = page.locator('input[placeholder*="Depth"]');
			// Shipping Details
			this.fixedShippingPriceInput = page.locator('input[placeholder*="Fixed Shipping Price"]');
			this.freeShippingCheckbox = page.locator('label:has-text("Free Shipping") input[type="checkbox"]');
			// Purchasability
			this.purchasabilityRadios = page.locator('section:has-text("Purchasability") input[type="radio"]');
			this.minPurchaseQtyInput = page.locator('input[placeholder*="Minimum Purchase Quantity"]');
			this.maxPurchaseQtyInput = page.locator('input[placeholder*="Maximum Purchase Quantity"]');
			// Gift Wrapping
			this.giftWrappingRadios = page.locator('section:has-text("Gift Wrapping options") input[type="radio"]');
			// Customs Information
			this.manageCustomsInfoCheckbox = page.locator('label:has-text("Manage customs information") input[type="checkbox"]');
			// SEO
			this.pageTitleInput = page.locator('input[placeholder*="Page Title"]');
			this.productUrlInput = page.locator('input[placeholder*="Product URL"]');
			this.metaDescriptionInput = page.locator('input[placeholder*="Meta Description"]');
			// Open Graph Sharing
			this.objectTypeDropdown = page.locator('select[aria-label="Object Type"]');
			this.useProductNameCheckbox = page.locator('label:has-text("Use product name") input[type="checkbox"]');
			this.useMetaDescriptionCheckbox = page.locator('label:has-text("Use meta description") input[type="checkbox"]');
			this.useThumbnailImageRadio = page.locator('label:has-text("Use thumbnail image") input[type="radio"]');
			this.dontUseImageRadio = page.locator('label:has-text("Don\'t use an image") input[type="radio"]');
		}
	// Categories
	async selectCategoryByName(name: string) {
		await this.page.locator(`section:has-text('Categories') label:has-text('${name}') input[type="checkbox"]`).check();
	}

	// Description
		
		async enterDescription(text: string) {
			await this.descriptionTextarea.fill(text);
		}

	// Product Identifiers
	async enterMPN(mpn: string) {
		await this.mpnInput.fill(mpn);
	}
	async enterUPC(upc: string) {
		await this.upcInput.fill(upc);
	}
	async enterGTIN(gtin: string) {
		await this.gtinInput.fill(gtin);
	}
	async enterBPN(bpn: string) {
		await this.bpnInput.fill(bpn);
	}

	// Pricing
	async selectTaxClass(taxClass: string) {
		await this.taxClassDropdown.selectOption({ label: taxClass });
	}
	async clickShowAdvancedPricing() {
		await this.showAdvancedPricingLink.click();
	}

	// Inventory
	async setTrackInventory(track: boolean) {
		const checked = await this.trackInventoryCheckbox.isChecked();
		if (checked !== track) {
			await this.trackInventoryCheckbox.click();
		}
	}
	async clickEditInventory() {
		await this.editInventoryButton.click();
	}

	// Variations & Customizations
	async clickAddVariantOption() {
		await this.addVariantOptionButton.click();
	}
	async clickAddModifierOption() {
		await this.addModifierOptionButton.click();
	}

	// Storefront Details
	async setFeaturedProduct(featured: boolean) {
		const checked = await this.featuredProductCheckbox.isChecked();
		if (checked !== featured) {
			await this.featuredProductCheckbox.click();
		}
	}
	async enterSearchKeywords(keywords: string) {
		await this.searchKeywordsInput.fill(keywords);
	}
	async enterSortOrder(order: string) {
		await this.sortOrderInput.fill(order);
	}
	async enterWarrantyInfo(info: string) {
		await this.warrantyInfoInput.fill(info);
	}
	async enterAvailabilityText(text: string) {
		await this.availabilityTextInput.fill(text);
	}
	async selectCondition(condition: string) {
		await this.conditionDropdown.selectOption({ label: condition });
	}
	async setShowConditionOnStorefront(show: boolean) {
		const checked = await this.showConditionCheckbox.isChecked();
		if (checked !== show) {
			await this.showConditionCheckbox.click();
		}
	}

	// Custom Fields
	async clickAddCustomFields() {
		await this.addCustomFieldsButton.click();
	}

	// Related Products
	async setShowRelatedProducts(show: boolean) {
		const checked = await this.showRelatedProductsCheckbox.isChecked();
		if (checked !== show) {
			await this.showRelatedProductsCheckbox.click();
		}
	}

	// Fulfillment (Dimensions & Weight)
	async enterWidth(width: string) {
		await this.widthInput.fill(width);
	}
	async enterHeight(height: string) {
		await this.heightInput.fill(height);
	}
	async enterDepth(depth: string) {
		await this.depthInput.fill(depth);
	}

	// Shipping Details
	async enterFixedShippingPrice(price: string) {
		await this.fixedShippingPriceInput.fill(price);
	}
	async setFreeShipping(free: boolean) {
		const checked = await this.freeShippingCheckbox.isChecked();
		if (checked !== free) {
			await this.freeShippingCheckbox.click();
		}
	}

	// Purchasability
	async selectPurchasability(optionIndex: number) {
		await this.purchasabilityRadios.nth(optionIndex).check();
	}
	async enterMinPurchaseQty(qty: string) {
		await this.minPurchaseQtyInput.fill(qty);
	}
	async enterMaxPurchaseQty(qty: string) {
		await this.maxPurchaseQtyInput.fill(qty);
	}

	// Gift Wrapping
	async selectGiftWrappingOption(optionIndex: number) {
		await this.giftWrappingRadios.nth(optionIndex).check();
	}

	// Customs Information
	async setManageCustomsInfo(manage: boolean) {
		const checked = await this.manageCustomsInfoCheckbox.isChecked();
		if (checked !== manage) {
			await this.manageCustomsInfoCheckbox.click();
		}
	}

	// SEO
	async enterPageTitle(title: string) {
		await this.pageTitleInput.fill(title);
	}
	async enterProductUrl(url: string) {
		await this.productUrlInput.fill(url);
	}
	async enterMetaDescription(desc: string) {
		await this.metaDescriptionInput.fill(desc);
	}

	// Open Graph Sharing
	async selectObjectType(type: string) {
		await this.objectTypeDropdown.selectOption({ label: type });
	}
	async setUseProductName(use: boolean) {
		const checked = await this.useProductNameCheckbox.isChecked();
		if (checked !== use) {
			await this.useProductNameCheckbox.click();
		}
	}
	async setUseMetaDescription(use: boolean) {
		const checked = await this.useMetaDescriptionCheckbox.isChecked();
		if (checked !== use) {
			await this.useMetaDescriptionCheckbox.click();
		}
	}
	async selectUseThumbnailImage() {
		await this.useThumbnailImageRadio.check();
	}
	async selectDontUseImage() {
		await this.dontUseImageRadio.check();
	}

	async enterProductName(name: string) {
		await this.productNameInput.fill(name);
	}

	async enterSKU(sku: string) {
		await this.skuInput.fill(sku);
	}

	async enterDefaultPrice(price: string) {
		await this.defaultPriceInput.fill(price);
	}

	async selectProductType(type: string) {
		await this.productTypeDropdown.selectOption({ label: type });
	}

	async selectBrand(brand: string) {
		await this.brandDropdown.fill(brand);
		// Optionally select from dropdown if needed
	}

	async enterWeight(weight: string) {
		await this.weightInput.fill(weight);
	}

	async setVisibleOnStorefront(visible: boolean) {
		const checked = await this.visibleOnStorefrontCheckbox.isChecked();
		if (checked !== visible) {
			await this.visibleOnStorefrontCheckbox.click();
		}
	}

	async clickAssignToChannels() {
		await this.assignToChannelsButton.click();
	}
}
