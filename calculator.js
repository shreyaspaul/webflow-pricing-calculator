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

// State management
console.log("Calculator script loaded");

const state = {
    currentStep: 'step1',
    userType: null,
    needs: null,
    roles: {
        full: 1,
        limited: 0,
        free: 0
    },
    billingCycle: null,
    recommendedPlan: null
};

// Helper functions
function showStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.add('hidden');
    });

    // Show current step
    const currentStep = document.getElementById(stepId);
    currentStep.classList.remove('hidden');

    // Update state
    state.currentStep = stepId;

    // Update navigation buttons
    updateNavigation();
}

function updateNavigation() {
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Show/hide back button
    if (state.currentStep === 'step1') {
        backBtn.classList.add('hidden');
    } else {
        backBtn.classList.remove('hidden');
    }

    // Update next button text
    if (state.currentStep === 'step4') {
        nextBtn.textContent = 'See Recommendation';
    } else {
        nextBtn.textContent = 'Next';
    }
}

function getNextStep() {
    switch (state.currentStep) {
        case 'step1':
            return state.userType === 'Freelancer or agency' ? 'step2A' : 'step2B';
        case 'step2A':
            state.recommendedPlan = state.needs === 'Manage many client projects with advanced collaboration features.' ? 'agency' : 'freelancer';
            return 'step3';  // Always go to team configuration
        case 'step2B':
            return state.needs === 'Build a website for my company.' ? 'starter_plan' : 'step3';
        case 'step3':
            return 'step4';
        case 'step4':
            return 'results';
        default:
            return null;
    }
}

function calculateCosts() {
    const plan = determineRecommendedPlan();
    const cycle = state.billingCycle === 'Yearly' ? 'price_yearly' : 'price_monthly';
    const pricingCategory = state.userType === 'Freelancer or agency' ? 'freelancers_agencies' : 'teams';
    
    // Base plan cost
    const baseCost = pricing[pricingCategory][plan.toLowerCase()][cycle];
    
    // Seat costs
    const seatCosts = {
        full: state.roles.full * seatPricing.full[cycle],
        limited: state.roles.limited * seatPricing.limited[cycle],
        free: 0 // Free seats are always free
    };
    
    return {
        base: baseCost,
        seats: seatCosts,
        total: baseCost + seatCosts.full + seatCosts.limited
    };
}

function determineRecommendedPlan() {
    if (state.userType === 'Freelancer or agency') {
        return state.recommendedPlan;
    } else {
        if (state.needs === 'Build a website for my company.') {
            return 'Starter';
        } else {
            // For team collaboration, base it on the number of seats and roles
            return (state.roles.full + state.roles.limited > 3) ? 'Growth' : 'Core';
        }
    }
}

function calculateSavings(monthlyPrice, yearlyPrice) {
    // Monthly price is per month, yearly price is also per month but billed yearly
    const monthlyTotal = monthlyPrice;
    const yearlyTotal = yearlyPrice;
    return Math.round(((monthlyTotal - yearlyTotal) / monthlyTotal) * 100);
}

function showRecommendation() {
    const resultsDiv = document.getElementById('results');
    const pricingData = state.userType === 'Freelancer or agency' ? pricing.freelancers_agencies : pricing.teams;
    let plan;
    let totalMonthly = 0;
    let totalYearly = 0;
    const isYearly = state.billingCycle === 'Yearly';

    if (state.userType === 'Freelancer or agency') {
        plan = state.recommendedPlan === 'agency' ? pricingData.agency : pricingData.freelancer;
        // Calculate base price
        totalMonthly = plan.price_monthly;
        totalYearly = plan.price_yearly;
        
        // Add seat costs
        if (state.roles.full > 1) {
            const additionalSeats = state.roles.full - 1;
            totalMonthly += additionalSeats * seatPricing.full.price_monthly;
            totalYearly += additionalSeats * seatPricing.full.price_yearly;
        }
        if (state.roles.limited > 0) {
            totalMonthly += state.roles.limited * seatPricing.limited.price_monthly;
            totalYearly += state.roles.limited * seatPricing.limited.price_yearly;
        }
    } else {
        // Team logic
        if (state.needs === 'Build a website for my company.') {
            plan = pricingData.starter;
        } else {
            plan = state.roles.full + state.roles.limited > 3 ? pricingData.growth : pricingData.core;
        }
        // Calculate total price for teams
        totalMonthly = plan.price_monthly;
        totalYearly = plan.price_yearly;
        if (state.roles.full > 1) {
            const additionalSeats = state.roles.full - 1;
            totalMonthly += additionalSeats * seatPricing.full.price_monthly;
            totalYearly += additionalSeats * seatPricing.full.price_yearly;
        }
        if (state.roles.limited > 0) {
            totalMonthly += state.roles.limited * seatPricing.limited.price_monthly;
            totalYearly += state.roles.limited * seatPricing.limited.price_yearly;
        }
    }

    const totalPrice = isYearly ? totalYearly : totalMonthly;
    const billingNote = isYearly ? ' per month, billed yearly' : '/month';
    const savings = calculateSavings(totalMonthly, totalYearly);
    const yearlySavings = totalMonthly - totalYearly;
    const yearlyTotal = totalYearly * 12;

    resultsDiv.innerHTML = `
        <h2 class="text-2xl font-bold mb-6">Your Recommended Plan</h2>
        <div class="bg-gray-800/50 rounded-xl p-6">
            <div class="mb-6">
                <h3 class="text-xl font-bold text-blue-400">${plan.plan_name} Plan</h3>
                <div class="mt-4 space-y-3">
                    <div class="flex justify-between items-center">
                        <span>Base Plan Price</span>
                        <span class="font-semibold">$${isYearly ? plan.price_yearly : plan.price_monthly}${billingNote}</span>
                    </div>
                    ${state.roles.full > 1 ? `
                        <div class="flex justify-between items-center">
                            <span>${state.roles.full - 1} Additional Full Access Seats</span>
                            <span class="font-semibold">$${(state.roles.full - 1) * (isYearly ? seatPricing.full.price_yearly : seatPricing.full.price_monthly)}${billingNote}</span>
                        </div>
                    ` : ''}
                    ${state.roles.limited > 0 ? `
                        <div class="flex justify-between items-center">
                            <span>${state.roles.limited} Limited Access Seats</span>
                            <span class="font-semibold">$${state.roles.limited * (isYearly ? seatPricing.limited.price_yearly : seatPricing.limited.price_monthly)}${billingNote}</span>
                        </div>
                    ` : ''}
                    ${state.roles.free > 0 ? `
                        <div class="flex justify-between items-center">
                            <span>${state.roles.free} Free Reviewer Seats</span>
                            <span class="font-semibold">Free</span>
                        </div>
                    ` : ''}
                    <div class="pt-3 border-t border-gray-700">
                        <div class="flex justify-between items-center">
                            <span class="font-bold">Total</span>
                            <span class="font-bold text-blue-400">$${totalPrice}${billingNote}</span>
                        </div>
                        ${isYearly ? `
                            <div class="mt-2">
                                <div class="flex justify-between items-center text-gray-400">
                                    <span>Total billed annually</span>
                                    <span class="font-semibold">$${yearlyTotal}/year</span>
                                </div>
                                <div class="text-sm text-gray-400 mt-2 text-right">
                                    Save ${savings}% with annual billing
                                </div>
                            </div>
                        ` : `
                            <div class="text-sm text-gray-400 mt-2 text-right">
                                Switch to yearly billing to pay $${totalYearly}/month instead
                                <br>
                                <span class="text-blue-400">Save $${yearlySavings}/month ($${yearlySavings * 12}/year)</span>
                            </div>
                        `}
                    </div>
                </div>
            </div>
            <div class="space-y-2 mt-6">
                <h4 class="font-semibold mb-3">Plan Features:</h4>
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

    // Show the results step
    showStep('results');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded");
    
    // Initialize by showing first step and hiding others
    document.querySelectorAll('.step:not(#step1)').forEach(step => {
        step.classList.add('hidden');
    });

    // Seat Management
    function updateSeatCount(type, increment) {
        const count = document.getElementById(`${type}Count`);
        let currentValue = parseInt(count.textContent);
        
        if (increment) {
            if (type === 'full' && currentValue < 10) {
                currentValue++;
            } else if ((type === 'limited' || type === 'free') && currentValue < 20) {
                currentValue++;
            }
        } else {
            if (type === 'full' && currentValue > 1) {
                currentValue--;
            } else if ((type === 'limited' || type === 'free') && currentValue > 0) {
                currentValue--;
            }
        }
        
        count.textContent = currentValue;
        state.roles[type] = currentValue;
        
        // Enable next button if at least one seat is selected
        const totalSeats = state.roles.full + state.roles.limited + state.roles.free;
        document.getElementById('nextBtn').disabled = totalSeats < 1;
    }

    // Add event listeners for seat buttons
    ['full', 'limited', 'free'].forEach(type => {
        document.getElementById(`decrement${type}`).addEventListener('click', () => {
            console.log(`Decrementing ${type} seats`);
            updateSeatCount(type, false);
        });
        
        document.getElementById(`increment${type}`).addEventListener('click', () => {
            console.log(`Incrementing ${type} seats`);
            updateSeatCount(type, true);
        });
    });

    // Step 1: User Type Selection
    document.querySelectorAll('#step1 .option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#step1 .option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            state.userType = btn.dataset.value;
            document.getElementById('nextBtn').disabled = false;
        });
    });

    // Step 2A: Freelancer/Agency Needs
    document.querySelectorAll('#step2A .option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#step2A .option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            state.needs = btn.dataset.value;
            document.getElementById('nextBtn').disabled = false;
        });
    });

    // Step 2B: Team/Company Needs
    document.querySelectorAll('#step2B .option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#step2B .option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            state.needs = btn.dataset.value;
            document.getElementById('nextBtn').disabled = false;
        });
    });

    // Step 4: Billing Cycle
    document.querySelectorAll('#step4 .option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#step4 .option-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            state.billingCycle = btn.dataset.value;
            document.getElementById('nextBtn').disabled = false;
        });
    });

    // Navigation
    document.getElementById('nextBtn').addEventListener('click', () => {
        const nextStep = getNextStep();
        if (nextStep === 'results') {
            showRecommendation();
        } else if (nextStep) {
            showStep(nextStep);
        }
    });

    document.getElementById('backBtn').addEventListener('click', () => {
        // Implement back navigation logic
        const previousSteps = {
            'step2A': 'step1',
            'step2B': 'step1',
            'step3': 'step2B',
            'step4': 'step3',
            'results': 'step4'
        };
        const prevStep = previousSteps[state.currentStep];
        if (prevStep) {
            showStep(prevStep);
        }
    });

    // Initialize
    showStep('step1');
});
