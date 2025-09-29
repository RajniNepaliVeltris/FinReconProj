-- BigCommerce Order Verification Queries
-- This file contains SQL queries for verifying orders in the BigCommerce database

-- Comprehensive Order Details Query
-- Parameters: @OrderNumber (the order number to verify)
SELECT DISTINCT
-- Core Order Information
o.Id AS OrderId,
o.OrderNumber,
o.TenantId,
o.SiteId,
o.CustomerAccountId,
o.Email,
o.Type AS OrderType,
o.Status AS OrderStatus,
o.PaymentStatus,
o.FulfillmentStatus,
o.ReturnStatus,
-- Order Dates
o.SubmittedDate,
o.AcceptedDate,
o.CancelledDate,
o.ClosedDate,
o.auditinfoCreateDate AS OrderCreateDate,
o.auditinfoUpdateDate AS OrderUpdateDate,
-- Order Financial Summary
o.SubTotal,
o.DiscountTotal,
o.DiscountedSubTotal,
o.DiscountedTotal,
o.ShippingSubTotal,
o.ShippingTotal,
o.ShippingTaxTotal,
o.ItemTaxTotal,
o.TaxTotal,
o.FeeTotal,
o.HandlingTotal,
o.Total,
o.TotalCollected,
o.AmountRefunded,
o.AmountRemainingForPayment,
-- Order Flags
o.IsEligibleForReturns,
o.IsPartialOrder,
o.IsTaxExempt,
-- Order Configuration
o.CurrencyCode,
o.PriceListCode,
o.CouponCodes,
-- Billing Information
bi.AuditInfoCreateDate,
bi.AuditInfoUpdateDate,
bi.BillingContactAddressAddress1,
bi.BillingContactAddressAddress2,
bi.BillingContactAddressCItyOrTown,
bi.BillingContactAddressCountryCode,
bi.BillingContactAddressPostalOrZipCode,
bi.BillingContactAddressStateOrProvince,
bi.BillingContactCompanyOrOrganization,
bi.BillingContactEmail,
bi.BillingContactFirstName,
bi.BillingContactLastNameOrSurName,
bi.BillingContactPhoneNumbersHome,
bi.BillingContactPhoneNumbersMobile,
bi.CardPaymentOrCardType,
bi.PaymentType,
-- Fulfillment Information
fi.AuditInfoCreateDate,
fi.AuditInfoUpdateDate,
fi.FulfillmentContactAddressAddress1,
fi.FulfillmentContactAddressAddress2,
fi.FulfillmentContactAddressCItyOrTown,
fi.FulfillmentContactAddressCountryCode,
fi.FulfillmentContactAddressPostalOrZipCode,
fi.FulfillmentContactAddressStateOrProvince,
fi.FulfillmentContactCompanyOrOrganization,
fi.FulfillmentContactEmail,
fi.FulfillmentContactFirstName,
fi.FulfillmentContactLastNameOrSurName,
fi.FulfillmentContactPhoneNumbersHome,
fi.FulfillmentContactPhoneNumbersMobile,
phi.ShippingMethodName,

-- Order Items Summary
oi.AuditInfoCreateDate,
oi.AuditInfoUpdateDate,
oi.DiscountedTotal,
oi.DiscountTotal,
oi.ExtendedTotal,
oi.FeeTotal,
oi.FulfillmentMethod,
oi.Id,
oi.IsTaxable,
oi.ItemTaxTotal,
oi.LineId,
oi.ProductDiscountCouponCode,
oi.ProductDiscountDiscountName,
oi.ProductDiscountDiscountQuantity,
oi.ProductDiscountExcluded,
oi.ProductDiscountImpact,
oi.ProductDiscountImpactPerUnit,
oi.ProductDiscountProductQuantity,
oi.Quantity,
oi.ShippingTaxTotal,
oi.ShippingTotal,
oi.SubTotal,
oi.TaxableTotal,
oi.Total,
oi.TotalWithWeightedShippingAndHandling,
oi.TotalWithoutWeightedShippingAndHandling,
oi.UnitPriceListAmount,
oi.UnitPriceSaleAmount,
oi.WeightedOrderShipping,
oi.WeightedOrderShippingDiscount,

---item product---

ip.Description,
ip.DiscountsRestricted,
ip.DiscountsRestrictedEndDate,
ip.DiscountsRestrictedStartDate,
ip.FulfillmentStatus,
ip.ImageUrl,
ip.IsTaxable,
ip.MfgPartNumber,
ip.PriceMsrp,
ip.PricePrice,
ip.PricePriceListCode,
ip.PriceSalePrice,
ip.ProductCode,
ip.ProductType,
ip.ProductUsage,
ipp.AttributeFQN,
ip.Name,

---item product property value---

ippv.StringValue,
ippv.[Value],

---item product bundled product---

ipbp.FulfillmentStatus,
ipbp.Name,
ipbp.ProductCode,
ipbp.Quantity,
-- Payment Information
p.AmountCollected,
p.AmountCredited,
p.AmountRequested,
p.AuditInfoCreateDate,
p.AuditInfoUpdateDate,
p.Id,
p.IsRecurring,
p.OrderId,
p.PaymentServiceTransactionId,
p.PaymentType,
p.PaymentWorkflow,
p.Status,
-- Payment Interactions
pi.Amount,
pi.AuditInfoCreateDate,
pi.AuditInfoUpdateDate,
pi.CurrencyCode,
pi.GatewayTransactionId,
pi.Id,
pi.InteractionDate,
pi.InteractionType,
pi.OrderId,
pi.PaymentEntryStatus,
pi.PaymentId,
pi.RefundId,
pi.ReturnId,
pi.Status,
-- Refund Information
r.orderId,
r.Amount,
r.Reason,
r.id,

---payment billing info---

pbi.AuditInfoCreateDate,
pbi.AuditInfoUpdateDate,
pbi.BillingContactAddressAddress1,
pbi.BillingContactAddressAddress2,
pbi.BillingContactAddressAddress3,
pbi.BillingContactAddressAddress4,
pbi.BillingContactAddressCItyOrTown,
pbi.BillingContactAddressCountryCode,
pbi.BillingContactAddressPostalOrZipCode,
pbi.BillingContactAddressStateOrProvince,
pbi.BillingContactCompanyOrOrganization,
pbi.BillingContactEmail,
pbi.BillingContactFirstName,
pbi.BillingContactId,
pbi.BillingContactLastNameOrSurName,
pbi.BillingContactPhoneNumbersHome,
pbi.CardPaymentOrCardType,
pbi.IsSameBillingShippingAddress,
pbi.PaymentType,
pbi.PurchaseOrderPurchaseOrderNumber,
-- Notes
ordnt.Text
-- Custom Attributes
--oa.PKMProcessedStatus,
--oa.AttributeValues

FROM [Order] o

-- Join Order Items
LEFT JOIN OrderItem oi ON o.entityorderid = oi.entityorderid

LEFT JOIN itemproduct ip ON oi.entityorderitemid = ip.entityorderitemid

LEFT JOIN itemproductbundleproduct ipbp ON ip.entityitemproductid = ipbp.entityitemproductid

LEFT JOIN itemproductproperty ipp ON ip.entityitemproductid = ipp.entityitemproductid

LEFT JOIN itemproductpropertyvalue ippv ON ipp.entityitemproductid = ippv.entityitemproductpropertyid

-- Join Payments
LEFT JOIN Payment p ON o.entityorderid = p.entityorderid

-- Join Payment Interactions
LEFT JOIN PaymentInteraction pi ON p.entityPaymentId = pi.entityPaymentId

LEFT JOIN paymentbillinginfo pbi ON p.entityPaymentId = pbi.entityPaymentId

LEFT JOIN BillingInfo bi ON o.entityorderid = bi.entityorderid

LEFT JOIN fulfillmentInfo fi ON o.entityorderid = fi.entityorderid

-- Join Refunds
LEFT JOIN Refund r ON o.entityorderid = r.entityorderid

-- Join Notes
LEFT JOIN ordernote ordnt ON o.entityorderid = ordnt.entityorderid

-- Join Attributes
LEFT JOIN OrderAttribute oa ON o.entityorderid = oa.entityorderid

WHERE o.OrderNumber = @OrderNumber;

-- Query to fetch order details by entityorderid
-- Parameters: @EntityOrderId (the entity order ID to verify)
SELECT o.Id AS OrderId,
    o.OrderNumber,
    o.TenantId,
    o.SiteId,
    o.CustomerAccountId,
    o.Email,
    o.Type AS OrderType,
    o.Status AS OrderStatus,
    o.PaymentStatus,
    o.FulfillmentStatus,
    o.ReturnStatus,
    -- Order Dates
    o.SubmittedDate,
    o.AcceptedDate,
    o.CancelledDate,
    o.ClosedDate,
    o.auditinfoCreateDate AS OrderCreateDate,
    o.auditinfoUpdateDate AS OrderUpdateDate,
    -- Order Financial Summary
    o.SubTotal,
    o.DiscountTotal,
    o.DiscountedSubTotal,
    o.DiscountedTotal,
    o.ShippingSubTotal,
    o.ShippingTotal,
    o.ShippingTaxTotal,
    o.ItemTaxTotal,
    o.TaxTotal,
    o.FeeTotal,
    o.HandlingTotal,
    o.Total,
    o.TotalCollected,
    o.AmountRefunded,
    o.AmountRemainingForPayment,
    -- Order Flags
    o.IsEligibleForReturns,
    o.IsPartialOrder,
    o.IsTaxExempt,
    -- Order Configuration
    o.CurrencyCode,
    o.PriceListCode,
    o.CouponCodes
FROM [order] o
WHERE entityorderid = @EntityOrderId;

-- Simple Order Existence Check Query
-- Parameters: @OrderNumber (the order number to check)
-- SELECT COUNT(*) as OrderCount FROM [Order] WHERE OrderNumber = @OrderNumber;

-- Order Summary Query (for quick verification)
-- Parameters: @OrderNumber (the order number to check)
-- SELECT
--     OrderNumber,
--     Status AS OrderStatus,
--     PaymentStatus,
--     FulfillmentStatus,
--     Total,
--     SubmittedDate,
--     auditinfoCreateDate AS CreatedDate
-- FROM [Order]
-- WHERE OrderNumber = @OrderNumber;

-- Query to fetch order attributes by entityorderid
-- Parameters: @EntityOrderId (the entity order ID to verify)
SELECT FullyQualifiedName,
       [Values]
FROM OrderAttribute
WHERE entityorderid = @EntityOrderId;

-- Query to fetch billing information by entityorderid
-- Parameters: @EntityOrderId (the entity order ID to verify)
SELECT *
FROM BillingInfo
WHERE entityorderid = @EntityOrderId;

-- Query to fetch fulfillment information by entityorderid
-- Parameters: @EntityOrderId (the entity order ID to verify)
SELECT *
FROM FulfillmentInfo
WHERE entityorderid = @EntityOrderId;

-- Fetch Order by EntityOrderId Query
SELECT *
FROM dbo.[Order]
WHERE entityorderid = @OrderNumber;