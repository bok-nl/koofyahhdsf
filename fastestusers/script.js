let previousFastestUser = null;

async function fetchData() {
    try {
        const response = await fetch('http://172.105.97.24:5215/top50_youtube_hexzd/live?akey=API-_key-8UCD7P7h0IjG3rF9dfJ7ahY6pnVJOhnTFaAqogmKg&skey=KarFC9A5zo8LMBDyiCgzEJQMG3X5ermp43o4cjHwarAn50');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateDisplay(user) {
    const profileImage = document.getElementById('profileImage');
    const channelName = document.getElementById('channelName');
    const subscriberCount = document.getElementById('subscriberCount');

    profileImage.src = user.cimage;
    channelName.innerText = user.cname;

    const currentCount = parseInt(user.subscriberCountRealAPI, 10);
    subscriberCount.innerText = formatNumber(currentCount);

    // Update the odometer
    subscriberCount.classList.add('odometer');
    setTimeout(() => {
        subscriberCount.classList.remove('odometer'); // Remove class
        void subscriberCount.offsetWidth;
        subscriberCount.classList.add('odometer');
        subscriberCount.innerText = formatNumber(currentCount);
    }, 0);
}

async function findFastestGrowingUser() {
    const data = await fetchData();
    if (!data || !data.length) return;

    let fastestUser = data[0];
    for (const user of data) {
        if (user.subscriberCountRealAPI > fastestUser.subscriberCountRealAPI) {
            fastestUser = user;
        }
    }

    if (previousFastestUser === null || fastestUser.cname !== previousFastestUser.cname) {
        updateDisplay(fastestUser);
        previousFastestUser = fastestUser;
    } else {
        updateDisplay(fastestUser);
    }
}

setInterval(findFastestGrowingUser, 5000);
