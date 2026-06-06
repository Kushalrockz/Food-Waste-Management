// Test login credentials using fetch
async function testLogin(email, password) {
    try {
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            console.log(`✅ ${email} / ${password} -> SUCCESS`);
            console.log(`   Role: ${data.role}, Name: ${data.name}`);
            return true;
        } else {
            console.log(`❌ ${email} / ${password} -> FAILED`);
            console.log(`   Error: ${data.error}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ ${email} / ${password} -> FAILED`);
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testAllCredentials() {
    console.log('Testing Login Credentials:');
    console.log('==========================');

    const credentials = [
        { email: 'admin@gmail.com', password: 'Admin123' },
        { email: 'recycler@gmail.com', password: 'Recycler123' },
        { email: 'donor@gmail.com', password: 'Donor123' },
        // Test old credentials too
        { email: 'donor@example.com', password: 'Donor123' }
    ];

    for (const cred of credentials) {
        await testLogin(cred.email, cred.password);
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

// Wait for backend to start, then test
setTimeout(() => {
    testAllCredentials();
}, 5000); // Wait 5 seconds for backend to start