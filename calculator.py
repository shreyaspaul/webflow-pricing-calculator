# Webflow Workspace Plan Calculator
def main():
    # Define Pricing Details
    pricing_data = {
        "teams": {
            "starter": {"price_yearly": 0, "price_monthly": 0, "features": ["Free", "2 staging sites", "1 seat"]},
            "core": {"price_yearly": 19, "price_monthly": 28, "features": ["10 staging sites", "1 seat"]},
            "growth": {"price_yearly": 49, "price_monthly": 60, "features": ["Unlimited staging", "Advanced roles"]},
            "enterprise": {"price_custom": "Contact Sales"}
        },
        "freelancers": {
            "starter": {"price_yearly": 0, "price_monthly": 0, "features": ["Free", "2 staging sites", "1 seat"]},
            "freelancer": {"price_yearly": 16, "price_monthly": 24, "features": ["10 staging sites", "CMS access"]},
            "agency": {"price_yearly": 35, "price_monthly": 42, "features": ["Unlimited staging", "Advanced roles"]}
        },
        "seats": {
            "full": {"price_yearly": 39, "price_monthly": 45},
            "limited": {"price_yearly": 15, "price_monthly": 19},
            "free": {"price_yearly": 0, "price_monthly": 0}
        }
    }
    
    # Introduction
    print("\nWelcome to the Webflow Workspace Plan Advisor!")
    print("We'll guide you through a few questions to find the right plan and estimate the cost.\n")
    
    # Step 1: User Type
    user_type = input("Are you:\n1. A team/company\n2. A freelancer/agency\nEnter 1 or 2: ")
    while user_type not in ["1", "2"]:
        user_type = input("Invalid choice. Enter 1 for team/company or 2 for freelancer/agency: ")
    user_type = "teams" if user_type == "1" else "freelancers"
    
    # Step 2: Purpose
    print("\nWhat do you primarily need Webflow for?")
    print("1. Build a website for yourself or your business.")
    print("2. Collaborate with team members.")
    print("3. Manage client projects.")
    purpose = input("Enter 1, 2, or 3: ")
    while purpose not in ["1", "2", "3"]:
        purpose = input("Invalid choice. Enter 1, 2, or 3: ")

    # Step 3: Base Plan Suggestion
    if purpose == "1":
        base_plan = "starter"
    elif purpose == "2":
        base_plan = "core" if user_type == "teams" else "freelancer"
    else:
        base_plan = "growth" if user_type == "teams" else "agency"

    print("\nGreat! We'll recommend the '{}' plan as a starting point.".format(base_plan.capitalize()))
    
    # Step 4: Seats Input
    print("\nHow many people will work in your workspace, and what roles do they have?")
    full_seats = int(input("Enter the number of Full seats (Admin/Designer role): "))
    limited_seats = int(input("Enter the number of Limited seats (Content Editors): "))
    free_seats = int(input("Enter the number of Free seats (Reviewers): "))

    # Step 5: Billing Cycle
    billing = input("\nDo you want to be billed:\n1. Yearly (Save up to 33%)\n2. Monthly\nEnter 1 or 2: ")
    while billing not in ["1", "2"]:
        billing = input("Invalid choice. Enter 1 for yearly or 2 for monthly: ")
    billing_cycle = "yearly" if billing == "1" else "monthly"

    # Step 6: Cost Calculation
    base_cost = pricing_data[user_type][base_plan][f"price_{billing_cycle}"]
    full_cost = full_seats * pricing_data["seats"]["full"][f"price_{billing_cycle}"]
    limited_cost = limited_seats * pricing_data["seats"]["limited"][f"price_{billing_cycle}"]
    free_cost = free_seats * pricing_data["seats"]["free"][f"price_{billing_cycle}"]
    total_cost = base_cost + full_cost + limited_cost + free_cost

    # Step 7: Output the Recommendation
    print("\n--- Recommended Plan and Cost Breakdown ---")
    print("Plan Type: {}".format(base_plan.capitalize()))
    print("Base Plan Cost: ${}/month".format(base_cost) if base_cost else "Free Plan")
    print("Full Seats ({} x ${}): ${}".format(full_seats, pricing_data["seats"]["full"][f"price_{billing_cycle}"], full_cost))
    print("Limited Seats ({} x ${}): ${}".format(limited_seats, pricing_data["seats"]["limited"][f"price_{billing_cycle}"], limited_cost))
    print("Free Seats ({} x ${}): ${}".format(free_seats, pricing_data["seats"]["free"][f"price_{billing_cycle}"], free_cost))
    print("Billing Cycle: {}".format("Yearly" if billing == "1" else "Monthly"))
    print("Total Cost: ${}/month".format(total_cost))

    print("\nThank you for using the Webflow Plan Advisor!")

if __name__ == "__main__":
    main()