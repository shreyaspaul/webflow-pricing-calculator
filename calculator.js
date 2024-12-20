// Pricing data from JSON
const pricing = {
    teams: {
        starter: {
            plan_name: "Starter",
            price_yearly: 0,
            price_monthly: 0,
            features: [
                "Free for teams",
                "2 staging sites",
                "1 full seat",
                "2 agency/freelancer guests"
            ]
        },
        core: {
            plan_name: "Core",
            price_yearly: 19,
            price_monthly: 28,
            features: [
                "10 staging sites",
                "1 full seat",
                "Basic collaboration features"
            ]
        },
        growth: {
            plan_name: "Growth",
            price_yearly: 49,
            price_monthly: 60,
            features: [
                "Unlimited staging sites",
                "Advanced roles and permissions",
                "Publishing permissions",
                "Shared libraries"
            ]
        }
    },
    freelancers_agencies: {
        starter: {
            plan_name: "Starter",
            price_yearly: 0,
            price_monthly: 0,
            features: [
                "Free for freelancers and agencies",
                "2 staging sites",
                "1 full seat"
            ]
        },
        freelancer: {
            plan_name: "Freelancer",
            price_yearly: 16,
            price_monthly: 24,
            features: [
                "10 staging sites",
                "Full CMS access",
                "Free guest access in client workspaces"
            ]
        },
        agency: {
            plan_name: "Agency",
            price_yearly: 35,
            price_monthly: 42,
            features: [
                "Unlimited staging sites",
                "Advanced roles and permissions",
                "Shared libraries"
            ]
        }
    }
};

const seatPricing = {
    full: {
        price_yearly: 39,
        price_monthly: 45
    },
    limited: {
        price_yearly: 15,
        price_monthly: 19
    },
    free: {
        price_yearly: 0,
        price_monthly: 0
    }
};

// Simple state object
let state = {
    currentStep: 'step1',
    userType: null,
    needs: null,
    roles: {
        full: 1,
        limited: 0,
        free: 0
    },
    billingCycle: null
};

// Basic navigation
function showStep(stepId) {
    // Hide all steps and results
    document.querySelectorAll('.step, #results').forEach(step => {
        step.style.display = 'none';
    });

    // Show the target step
    const targetStep = document.getElementById(stepId);
    if (targetStep) {
        targetStep.style.display = 'block';
        state.currentStep = stepId;
    }

    // Update navigation buttons
    updateNavigation();
}

function updateNavigation() {
    const nav = document.querySelector('.navigation');
    if (!nav) return;

    // Special case for results page
    if (state.currentStep === 'results') {
        nav.innerHTML = `
            <button onclick="showStep('step4')" class="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">Back</button>
            <a href="https://webflow.com/pricing" target="_blank" class="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500">Go to Webflow</a>
        `;
        return;
    }

    // Regular navigation
    const isFirstStep = state.currentStep === 'step1';
    nav.innerHTML = `
        <button onclick="handleBack()" class="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100" ${isFirstStep ? 'style="display:none"' : ''}>Back</button>
        <button onclick="handleNext()" class="next-btn px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500" disabled>
            ${state.currentStep === 'step4' ? 'See Recommendation' : 'Next'}
        </button>
    `;
}

function handleBack() {
    switch (state.currentStep) {
        case 'step2A':
        case 'step2B':
            showStep('step1');
            break;
        case 'step3':
            showStep(state.userType === 'Freelancer or agency' ? 'step2A' : 'step2B');
            break;
        case 'step4':
            showStep('step3');
            break;
    }
}

function handleNext() {
    switch (state.currentStep) {
        case 'step1':
            showStep(state.userType === 'Freelancer or agency' ? 'step2A' : 'step2B');
            break;
        case 'step2A':
            showStep('step3');
            break;
        case 'step2B':
            if (state.needs === 'Build a website for my company.') {
                showStep('step4');
            } else {
                showStep('step3');
            }
            break;
        case 'step3':
            showStep('step4');
            break;
        case 'step4':
            calculateAndShowResults();
            break;
    }
}

// Handle option selection
function selectOption(stepId, button, value) {
    // Clear previous selection
    document.querySelectorAll(`#${stepId} .option-btn`).forEach(btn => {
        btn.style.backgroundColor = '';
        btn.style.color = '';
        btn.classList.remove('selected');
    });

    // Mark this option as selected
    button.style.backgroundColor = '#2563eb';
    button.style.color = 'white';
    button.classList.add('selected');

    // Update state
    if (stepId === 'step1') {
        state.userType = value;
    } else if (stepId === 'step2A' || stepId === 'step2B') {
        state.needs = value;
    } else if (stepId === 'step4') {
        state.billingCycle = value;
    }

    // Enable next button
    document.querySelector('.next-btn').disabled = false;
}

// Handle seat count updates
function updateSeatCount(type, increment) {
    const countElement = document.getElementById(`${type}Count`);
    let count = parseInt(countElement.textContent);

    if (increment) {
        if (type === 'full' && count < 10) count++;
        else if ((type === 'limited' || type === 'free') && count < 20) count++;
    } else {
        if (type === 'full' && count > 1) count--;
        else if ((type === 'limited' || type === 'free') && count > 0) count--;
    }

    countElement.textContent = count;
    state.roles[type] = count;
    document.querySelector('.next-btn').disabled = false;
}

function calculateAndShowResults() {
    const resultsDiv = document.getElementById('results');
    const isYearly = state.billingCycle === 'Yearly';
    
    // Determine pricing category and plan
    const pricingData = state.userType === 'Freelancer or agency' ? pricing.freelancers_agencies : pricing.teams;
    let plan;
    
    if (state.userType === 'Freelancer or agency') {
        plan = state.needs === 'Manage many client projects with advanced collaboration features.' ? pricingData.agency : pricingData.freelancer;
    } else {
        if (state.needs === 'Build a website for my company.') {
            plan = pricingData.starter;
        } else {
            plan = (state.roles.full + state.roles.limited > 3) ? pricingData.growth : pricingData.core;
        }
    }

    // Calculate costs
    let totalMonthly = plan.price_monthly;
    let totalYearly = plan.price_yearly;

    if (state.roles.full > 1) {
        const additionalSeats = state.roles.full - 1;
        totalMonthly += additionalSeats * seatPricing.full.price_monthly;
        totalYearly += additionalSeats * seatPricing.full.price_yearly;
    }
    
    if (state.roles.limited > 0) {
        totalMonthly += state.roles.limited * seatPricing.limited.price_monthly;
        totalYearly += state.roles.limited * seatPricing.limited.price_yearly;
    }

    const finalPrice = isYearly ? totalYearly : totalMonthly;
    const billingNote = isYearly ? ' per month, billed yearly' : '/month';
    const savings = Math.round(((totalMonthly - totalYearly) / totalMonthly) * 100);

    // Update results HTML
    resultsDiv.innerHTML = `
        <h2 class="text-2xl font-bold mb-6">Your Recommended Plan</h2>
        <div class="bg-gray-800/50 rounded-xl p-6">
            <h3 class="text-xl font-bold text-blue-400">${plan.plan_name} Plan</h3>
            <div class="mt-4 space-y-3">
                <div class="flex justify-between items-center">
                    <span>Total Price</span>
                    <span class="font-bold text-blue-400">$${finalPrice}${billingNote}</span>
                </div>
                ${isYearly ? `
                    <div class="text-sm text-gray-400 text-right">
                        Save ${savings}% with annual billing
                    </div>
                ` : ''}
            </div>
            <div class="mt-6 space-y-2">
                <h4 class="font-semibold">Plan Features:</h4>
                ${plan.features.map(feature => `
                    <div class="flex items-center">
                        <svg class="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>${feature}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    showStep('results');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Show first step
    showStep('step1');
    
    // Setup option buttons
    document.querySelectorAll('.option-btn').forEach(button => {
        button.onclick = () => {
            const stepId = button.closest('.step').id;
            const value = button.getAttribute('data-value');
            selectOption(stepId, button, value);
        };
    });
    
    // Setup seat management buttons
    ['full', 'limited', 'free'].forEach(type => {
        document.getElementById(`decrement${type}`).onclick = () => updateSeatCount(type, false);
        document.getElementById(`increment${type}`).onclick = () => updateSeatCount(type, true);
    });
});
