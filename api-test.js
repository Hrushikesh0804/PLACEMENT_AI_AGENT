// Create this file as test-api.js and run it to debug your API
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🧪 Testing Placement Agent API...\n');

  try {
    // Test 1: Basic server health
    console.log('1. Testing basic server connection...');
    const healthRes = await axios.get(BASE_URL);
    console.log('✅ Server is running:', healthRes.data);
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    return;
  }

  try {
    // Test 2: Get all exams (without auth for initial test)
    console.log('\n2. Testing /api/exams endpoint...');
    const examsRes = await axios.get(`${BASE_URL}/api/exams`);
    console.log('✅ Exams endpoint working. Found', examsRes.data.length, 'exams');
    console.log('Sample exam:', examsRes.data[0]);
  } catch (error) {
    console.log('❌ /api/exams failed:', error.response?.status, error.response?.data);
    console.log('Full error:', error.message);
  }

  // Get a sample exam ID for testing
  let examId = '689776e712874a0736fd7b8b'; // From your MongoDB screenshots

  try {
    // Test 3: Get specific exam with questions (without auth for initial test)
    console.log(`\n3. Testing /api/exams/${examId} endpoint...`);
    const examRes = await axios.get(`${BASE_URL}/api/exams/${examId}`);
    console.log('✅ Specific exam endpoint working');
    console.log('Exam:', examRes.data.exam.title);
    console.log('Questions count:', examRes.data.questions.length);
    if (examRes.data.questions.length > 0) {
      console.log('Sample question:', examRes.data.questions[0].questionText);
    }
  } catch (error) {
    console.log('❌ /api/exams/:id failed:', error.response?.status, error.response?.data);
    console.log('Full error:', error.message);
  }

  // Now test with authentication (you'll need a valid token)
  console.log('\n4. Testing with authentication...');
  console.log('ℹ️  To test with auth, get a token from your login endpoint first');
  
  // Example of how to test with auth:
  // const token = 'your-jwt-token-here';
  // const config = { headers: { 'x-auth-token': token } };
  // const authExamRes = await axios.get(`${BASE_URL}/api/exams/${examId}`, config);
}

// Run the test
testAPI().catch(console.error);

// Usage: node test-api.js