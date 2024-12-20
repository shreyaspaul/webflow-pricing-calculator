document.addEventListener('alpine:init', () => {
    Alpine.data('calculator', () => ({
        step: 1,
        userType: '',
        needs: '',
        seats: {
            full: 1,
            limited: 0,
            free: 0
        },
        billing: '',
        recommendedPlan: null,

        calculateRecommendation() {
            const totalSeats = this.seats.full + this.seats.limited;
            
            let basePlan = {
                name: '',
                basePrice: {
                    monthly: 0,
                    yearly: 0
                },
                seatPrices: {
                    full: {
                        monthly: 45,
                        yearly: 39
                    },
                    limited: {
                        monthly: 19,
                        yearly: 15
                    },
                    free: {
                        monthly: 0,
                        yearly: 0
                    }
                },
                features: []
            };

            // Set base plan details
            if (this.userType === 'freelancer') {
                if (this.needs === 'build') {
                    basePlan = {
                        name: 'Freelancer',
                        basePrice: {
                            monthly: 24,
                            yearly: 16
                        },
                        seatPrices: {
                            full: {
                                monthly: 45,
                                yearly: 39
                            },
                            limited: {
                                monthly: 19,
                                yearly: 15
                            },
                            free: {
                                monthly: 0,
                                yearly: 0
                            }
                        },
                        features: [
                            '10 staging sites',
                            'Full CMS access',
                            'Free guest access in client workspaces'
                        ]
                    };
                } else {
                    basePlan = {
                        name: 'Agency',
                        basePrice: {
                            monthly: 42,
                            yearly: 35
                        },
                        seatPrices: {
                            full: {
                                monthly: 45,
                                yearly: 39
                            },
                            limited: {
                                monthly: 19,
                                yearly: 15
                            },
                            free: {
                                monthly: 0,
                                yearly: 0
                            }
                        },
                        features: [
                            'Unlimited staging sites',
                            'Advanced roles and permissions',
                            'Shared libraries'
                        ]
                    };
                }
            } else {
                if (this.needs === 'company') {
                    basePlan = {
                        name: 'Core',
                        basePrice: {
                            monthly: 28,
                            yearly: 19
                        },
                        seatPrices: {
                            full: {
                                monthly: 45,
                                yearly: 39
                            },
                            limited: {
                                monthly: 19,
                                yearly: 15
                            },
                            free: {
                                monthly: 0,
                                yearly: 0
                            }
                        },
                        features: [
                            '10 staging sites',
                            '1 full seat',
                            'Basic collaboration features'
                        ]
                    };
                } else if (totalSeats <= 3) {
                    basePlan = {
                        name: 'Core',
                        basePrice: {
                            monthly: 28,
                            yearly: 19
                        },
                        seatPrices: {
                            full: {
                                monthly: 45,
                                yearly: 39
                            },
                            limited: {
                                monthly: 19,
                                yearly: 15
                            },
                            free: {
                                monthly: 0,
                                yearly: 0
                            }
                        },
                        features: [
                            '10 staging sites',
                            '1 full seat',
                            'Basic collaboration features'
                        ]
                    };
                } else {
                    basePlan = {
                        name: 'Growth',
                        basePrice: {
                            monthly: 60,
                            yearly: 49
                        },
                        seatPrices: {
                            full: {
                                monthly: 45,
                                yearly: 39
                            },
                            limited: {
                                monthly: 19,
                                yearly: 15
                            },
                            free: {
                                monthly: 0,
                                yearly: 0
                            }
                        },
                        features: [
                            'Unlimited staging sites',
                            'Advanced roles and permissions',
                            'Publishing permissions',
                            'Shared libraries'
                        ]
                    };
                }
            }

            const billingType = this.billing === 'yearly' ? 'yearly' : 'monthly';
            
            // Calculate costs
            const seatCosts = {
                // Subtract 1 from full seats since one is included in base plan
                full: Math.max(0, this.seats.full - 1) * basePlan.seatPrices.full[billingType],
                limited: this.seats.limited * basePlan.seatPrices.limited[billingType],
                free: 0
            };

            const basePrice = basePlan.basePrice[billingType];
            const subtotal = basePrice + seatCosts.full + seatCosts.limited;

            this.recommendedPlan = {
                name: basePlan.name,
                basePrice: basePrice,
                seatPrices: {
                    full: basePlan.seatPrices.full[billingType],
                    limited: basePlan.seatPrices.limited[billingType],
                    free: 0
                },
                features: basePlan.features,
                breakdown: {
                    base: basePrice,
                    seatCosts,
                    subtotal,
                    billing: this.billing,
                    total: subtotal,
                    includedFullSeats: 1
                }
            };

            this.step = 5;
        },

        formatPrice(price) {
            return price.toFixed(2);
        },

        nextStep() {
            if (this.step === 1 && this.userType) {
                this.step = 2;
            } else if (this.step === 2 && this.needs) {
                this.step = 3;
            } else if (this.step === 3) {
                this.step = 4;
            } else if (this.step === 4 && this.billing) {
                this.calculateRecommendation();
            }
        },

        prevStep() {
            if (this.step > 1) {
                this.step--;
            }
        },

        selectUserType(type) {
            this.userType = type;
            this.needs = '';
        },

        selectNeed(need) {
            this.needs = need;
        },

        selectBilling(type) {
            this.billing = type;
        },

        updateSeats(type, increment) {
            if (increment) {
                if (type === 'full' && this.seats[type] < 10) {
                    this.seats[type]++;
                } else if ((type === 'limited' || type === 'free') && this.seats[type] < 20) {
                    this.seats[type]++;
                }
            } else {
                if (type === 'full' && this.seats[type] > 1) {
                    this.seats[type]--;
                } else if ((type === 'limited' || type === 'free') && this.seats[type] > 0) {
                    this.seats[type]--;
                }
            }
        }
    }));
});
