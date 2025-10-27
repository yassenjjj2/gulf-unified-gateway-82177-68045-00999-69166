// Test Telegram Bot Integration
const BOT_TOKEN = '8208871147:AAGaRBd64i-1jneToDRe6XJ8hYXdBNnBLl0';
const CHAT_ID = '8208871147';

async function testTelegramConnection() {
  try {
    console.log('Testing Telegram connection...');
    
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `🧪 <b>اختبار الاتصال</b>\n\n✅ <b>تم إرسال رسالة اختبار بنجاح!</b>\n• المنصة: Gulf Unified Platform\n• الوقت: ${new Date().toLocaleString('ar-SA')}\n• الحالة: متصل`,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Telegram test successful!');
      console.log('Message ID:', data.result?.message_id);
      console.log('Response:', data);
    } else {
      console.error('❌ Telegram test failed!');
      console.error('Error:', data);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Test different message types
async function testShippingLinkCreated() {
  try {
    console.log('Testing shipping link created message...');
    
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `🚚 <b>تم إنشاء رابط شحن جديد</b>\n\n📦 <b>تفاصيل الشحنة:</b>\n• رقم الشحنة: <code>TEST123456</code>\n• خدمة الشحن: أرامكس - Aramex\n• وزن الطرد: 2.5 كجم\n• وصف الطرد: ملابس واكسسوارات\n• مبلغ الدفع: 150 ر.س\n• الدولة: المملكة العربية السعودية\n• رابط الدفع: <a href="https://gulf-unified-platform.netlify.app/r/SA/shipping/test123?service=aramex">اضغط هنا</a>\n\n⏰ <i>الوقت: ${new Date().toLocaleString('ar-SA')}</i>`,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Shipping link test successful!');
      console.log('Message ID:', data.result?.message_id);
    } else {
      console.error('❌ Shipping link test failed!');
      console.error('Error:', data);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Run tests
console.log('Starting Telegram Bot Tests...\n');

testTelegramConnection()
  .then(() => {
    console.log('\n---\n');
    return testShippingLinkCreated();
  })
  .then(() => {
    console.log('\n✅ All tests completed!');
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error);
  });