// server.ts
import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

// src/data/demoEvents.ts
var INITIAL_DEMO_EVENTS = [
  {
    id: "demo-jaipur-wedding",
    name: "Aarav & Meera\u2019s Heritage Jaipur Wedding",
    category: "wedding",
    date: "2026-12-18",
    location: "Jaipur, Rajasthan",
    guestCount: 180,
    targetBudget: 85e4,
    currency: "INR",
    currencySymbol: "\u20B9",
    preferredTheme: "Royal Heritage Courtyard & Amber Candlelight",
    culturalPreferences: "Traditional Rajasthani & North Indian Hindu rituals with warm family hospitality",
    mustHaveExperiences: "Manganiyar folk welcome, live gourmet chaat & thali dining, phere under stars, handwritten brass keepsakes",
    restrictionsOrRequirements: "100% pure vegetarian menu (with Jain options); elder-accessible seating in courtyard",
    planningPriorities: ["Venue", "Food and catering", "Decoration", "Guest experience"],
    weddingSpecifics: {
      weddingStyle: "Intimate Heritage Haveli Outdoor Celebration",
      numberOfFunctions: 3,
      ceremonyPreferences: "Afternoon Mehendi Courtyard, Twilight Sangeet, Sunset Varmala & Starlight Phere",
      familyTraditions: "Rajasthani Padharo Mhare Desh folk welcome, Haldi with organic marigold petals, Kashi Yatra ritual"
    },
    isDemo: true,
    blueprint: {
      eventConcept: "An architectural heritage courtyard celebration in Jaipur that pairs centuries-old sandstone arches with local marigold installations, brass diyas, and soulful Manganiyar folk acoustics\u2014delivering a royal experience within a disciplined \u20B98,50,000 budget.",
      personalizedTheme: "Amber Sandstone & Emerald Haveli Twilight",
      colorPalette: [
        { name: "Deep Forest Emerald", hex: "#1B4332", usage: "Primary velvet drapes, invitation monograms & table runners" },
        { name: "Jaipur Sandstone Ivory", hex: "#FAF8F5", usage: "Courtyard canopies, linen base & ceremonial seating" },
        { name: "Antique Brass Gold", hex: "#C5A059", usage: "Urli bowls, candle hurricanes & thali silverware" },
        { name: "Marigold Saffron", hex: "#D97706", usage: "Fresh local floral garlands & welcome torans" },
        { name: "Heritage Terracotta Rose", hex: "#9E473B", usage: "Phere mandap textiles & cushion accents" }
      ],
      decorationRecommendations: [
        "Frame existing haveli sandstone arches with locally sourced marigold & mogra garlands instead of expensive imported orchids.",
        "Float 120 hand-beaten brass urlis with rose petals and beeswax diyas along the central courtyard reflection path.",
        "Use raw organic cotton canopies in warm ivory for daytime Mehendi shade, transitioning to amber fairy-light canopies at dusk."
      ],
      venueConsiderations: [
        "Book a boutique heritage haveli in Amer/Bani Park with an open central chowk (courtyard) that accommodates 180 guests comfortably.",
        "Ensure step-free ramp access from the main pol (gate) to the mandap lounge for senior family members.",
        "Lock a covered darbar hall inside the same property as an instant cold-evening or winter-dew backup."
      ],
      foodAndCateringRecommendations: [
        "Curate an Artisanal Rajasthani & North Indian Vegetarian Feast: Live Dal Baati Churma station, Jodhpuri Mirchi Vada, and Palak Patta Chaat.",
        "Create a dedicated Jain-certified counter with zero root vegetables clearly signed in brass frames.",
        "Serve warm Kesar Badam Milk in clay kulhads during the late-evening phere ceremony."
      ],
      entertainmentSuggestions: [
        "4-piece Manganiyar folk ensemble with kamaicha and dholak for guest arrival and Varmala entry.",
        "Curated family Sangeet choreography followed by an acoustic Sufi-indie fusion duo and celebration DJ.",
        "Interactive lac bangle-making artisan corner during the afternoon Mehendi function."
      ],
      guestExperienceIdeas: [
        "Welcome guests at the haveli gate with rosewater sprinklers, sandalwood ittar roll-ons, and fresh mogra wrist gajras.",
        "Provide pashmina-style warm shawls in forest green baskets for guests during the December outdoor evening ceremony.",
        "Place illustrated bilingual ritual cards on every chair explaining the meaning of each wedding vow."
      ],
      vendorCategoriesNeeded: [
        "Venues",
        "Caterers",
        "Decorators",
        "Photographers",
        "DJs and entertainers",
        "Florists",
        "Transportation",
        "Invitation designers"
      ],
      priorityChecklist: [
        "Lock boutique heritage haveli courtyard & indoor darbar backup for Dec 18",
        "Confirm per-plate vegetarian + Jain catering menu and live kulhad beverage counter",
        "Approve local marigold, mogra & brass lantern decor plot to reuse across Mehendi and Reception",
        "Collect out-of-town guest train/flight arrival times for shuttle wave scheduling"
      ],
      riskAndContingency: [
        "December evening temperature drop in Jaipur (down to 10\xB0C): Deploy 8 discreet mushroom patio heaters and warm kulhad saffron milk service.",
        "Budget creep on multi-function decor: Reuse structural floral arches from daytime Mehendi by swapping marigold strings for warm brass lanterns at night.",
        "Noise curfew at 10:00 PM outdoors: Transition high-energy DJ dancing into the soundproofed indoor Darbar Hall after 9:45 PM."
      ],
      personalizedRecommendations: [
        "Because your \u20B98,50,000 budget covers 180 guests in Jaipur, letting the heritage haveli architecture act as 70% of your visual backdrop saves \u20B91.4L in artificial stage fabrication.",
        "Sourcing seasonal marigolds, desi roses, and clay kulhads directly from Jaipur\u2019s Phool Mandi keeps aesthetics authentic and affordable."
      ],
      whyItMatches: "Designed specifically for 180 guests in Jaipur within \u20B98,50,000: prioritizes authentic Rajasthani heritage hospitality, pure vegetarian/Jain culinary excellence, and smart multi-function decor reuse so every rupee enhances guest warmth rather than disposable props."
    },
    budgetItems: [
      {
        id: "jw-b1",
        category: "Venue",
        title: "Boutique Heritage Haveli Courtyard & Darbar Hall (Full Day)",
        allocatedAmount: 24e4,
        plannedAmount: 24e4,
        vendorQuotationAmount: 25e4,
        actualAmount: 245e3,
        paidAmount: 15e4,
        isCommitted: true,
        isAiEstimate: false,
        notes: "Includes central courtyard, indoor hall backup, and 6 bridal/family changing suites [DEMO DATA]"
      },
      {
        id: "jw-b2",
        category: "Food and catering",
        title: "Royal Rajasthani & Jain Pure Vegetarian Feast (180 Guests \xD7 3 Meals/High-Tea)",
        allocatedAmount: 27e4,
        plannedAmount: 28e4,
        vendorQuotationAmount: 285e3,
        actualAmount: 274e3,
        paidAmount: 12e4,
        isCommitted: true,
        isAiEstimate: false,
        notes: "\u20B91,522 per guest all-inclusive across Mehendi lunch, Sangeet chaat, and Wedding reception dinner [DEMO DATA]"
      },
      {
        id: "jw-b3",
        category: "Decoration",
        title: "Local Marigold Torans, Brass Urlis, Mandap Canopy & Architectural Lighting",
        allocatedAmount: 11e4,
        plannedAmount: 12e4,
        vendorQuotationAmount: 125e3,
        actualAmount: 118e3,
        paidAmount: 6e4,
        isCommitted: true,
        isAiEstimate: true,
        estimateAssumptions: "Assumes modular mandap frame reused from Mehendi lounge with evening lantern swap."
      },
      {
        id: "jw-b4",
        category: "Photography",
        title: "Editorial Documentary Photography & Highlight Film (2-Person Crew)",
        allocatedAmount: 75e3,
        plannedAmount: 75e3,
        vendorQuotationAmount: 75e3,
        actualAmount: 75e3,
        paidAmount: 35e3,
        isCommitted: true,
        isAiEstimate: false
      },
      {
        id: "jw-b5",
        category: "Entertainment",
        title: "Manganiyar Folk Quartet, Lac Bangle Artisan & Sangeet Sound/DJ",
        allocatedAmount: 5e4,
        plannedAmount: 5e4,
        vendorQuotationAmount: 52e3,
        actualAmount: 48e3,
        paidAmount: 2e4,
        isCommitted: true,
        isAiEstimate: true,
        estimateAssumptions: "Direct folk ensemble booking + in-house acoustic PA system."
      },
      {
        id: "jw-b6",
        category: "Accommodation",
        title: "Partner Heritage Guesthouse Block (15 Rooms for Outstation Elders)",
        allocatedAmount: 45e3,
        plannedAmount: 45e3,
        vendorQuotationAmount: 45e3,
        actualAmount: 45e3,
        paidAmount: 25e3,
        isCommitted: true,
        isAiEstimate: false
      },
      {
        id: "jw-b7",
        category: "Transportation",
        title: "2 Tempo Traveller Shuttles (Station/Airport & Hotel Transfers)",
        allocatedAmount: 18e3,
        plannedAmount: 18e3,
        vendorQuotationAmount: 19e3,
        actualAmount: 18e3,
        paidAmount: 5e3,
        isCommitted: false,
        isAiEstimate: true,
        estimateAssumptions: "2 scheduled shuttle loops from Jaipur Junction & Airport."
      },
      {
        id: "jw-b8",
        category: "Invitations",
        title: "Digital Illustrated Suite + 40 Gold-Foiled Keepsake Cards for Elders",
        allocatedAmount: 8e3,
        plannedAmount: 8e3,
        vendorQuotationAmount: 7500,
        actualAmount: 7500,
        paidAmount: 7500,
        isCommitted: true,
        isAiEstimate: false
      },
      {
        id: "jw-b9",
        category: "Miscellaneous",
        title: "Ittar Welcome Kits, Pashmina Shawls & Blue Pottery Guest Favors",
        allocatedAmount: 14e3,
        plannedAmount: 14e3,
        vendorQuotationAmount: 15e3,
        actualAmount: 13500,
        paidAmount: 1e4,
        isCommitted: false,
        isAiEstimate: true,
        estimateAssumptions: "Wholesale Jaipur craft market sourcing."
      },
      {
        id: "jw-b10",
        category: "Emergency reserve",
        title: "Protected 2.5% Contingency & Patio Heater Buffer",
        allocatedAmount: 2e4,
        plannedAmount: 2e4,
        vendorQuotationAmount: 0,
        actualAmount: 0,
        paidAmount: 0,
        isCommitted: false,
        isAiEstimate: true,
        estimateAssumptions: "Unspent buffer reserved for weather heaters or last-minute guest plates."
      }
    ],
    timelineTasks: [
      {
        id: "jw-t1",
        title: "Lock Heritage Haveli Courtyard & Sign Deposit Agreement",
        milestoneCategory: "Booking deadline",
        dueDate: "2026-09-15",
        priority: "High",
        status: "Completed",
        assignedPerson: "Aarav & Father",
        progress: 100,
        notes: "Contract signed with indoor Darbar Hall backup clause included."
      },
      {
        id: "jw-t2",
        title: "Send Illustrated Digital Save-the-Dates & RSVP Tracker",
        milestoneCategory: "Invitation deadline",
        dueDate: "2026-10-05",
        priority: "High",
        status: "Completed",
        assignedPerson: "Meera",
        progress: 100
      },
      {
        id: "jw-t3",
        title: "Finalize Pure Vegetarian & Jain Menu Tasting with Caterer",
        milestoneCategory: "Catering finalization",
        dueDate: "2026-10-22",
        priority: "High",
        status: "In Progress",
        assignedPerson: "Meera & Mother",
        progress: 75,
        notes: "Need to confirm Jain counter separation and kulhad Kesar milk count."
      },
      {
        id: "jw-t4",
        title: "Approve Courtyard Floral Reuse Plan & Brass Lantern Plot",
        milestoneCategory: "Decoration planning",
        dueDate: "2026-11-10",
        priority: "High",
        status: "In Progress",
        assignedPerson: "Ananya (Sister)",
        progress: 50
      },
      {
        id: "jw-t5",
        title: "Collect Outstation Guest RSVP Confirmations & Train Numbers",
        milestoneCategory: "Guest confirmation deadline",
        dueDate: "2026-11-20",
        priority: "Medium",
        status: "Pending",
        assignedPerson: "Rohan (Cousin)",
        progress: 30
      },
      {
        id: "jw-t6",
        title: "Release 50% Milestone Payment to Caterer & Decorator",
        milestoneCategory: "Payment deadline",
        dueDate: "2026-11-28",
        priority: "High",
        status: "Pending",
        assignedPerson: "Aarav",
        progress: 0
      },
      {
        id: "jw-t7",
        title: "Confirm Manganiyar Folk Setlist & Sangeet Audio Tech Check",
        milestoneCategory: "Preparation milestone",
        dueDate: "2026-12-05",
        priority: "Medium",
        status: "Pending",
        assignedPerson: "Kabir (Best Man)",
        progress: 10
      },
      {
        id: "jw-t8",
        title: "Distribute Printed Run-of-Show & Moment Map Brief to All Vendors",
        milestoneCategory: "Final event-day preparation",
        dueDate: "2026-12-16",
        priority: "High",
        status: "Pending",
        assignedPerson: "Aarav & Meera",
        progress: 0
      }
    ],
    vendors: [
      {
        id: "jw-v1",
        name: "Suryagarh Heritage Courtyard Haveli [SAMPLE DEMO VENDOR]",
        category: "Venues",
        contactName: "Kunwar Devendra Singh (Demo)",
        contactEmailOrPhone: "demo-venue@example.invalid",
        location: "Bani Park, Jaipur",
        quotationAmount: 245e3,
        bookingStatus: "Booked",
        paymentStatus: "Deposit Paid",
        serviceQualityScore: 5,
        eventCompatibilityScore: 5,
        availabilityStatus: "Available",
        negotiationNotes: "DEMO DATA: Includes courtyard, indoor darbar hall, generator backup, and 6 suites.",
        isSampleDemoData: true
      },
      {
        id: "jw-v2",
        name: "Amer Bagh Royal Lawns [SAMPLE DEMO VENDOR]",
        category: "Venues",
        contactName: "Vikramaditya Joshi (Demo)",
        contactEmailOrPhone: "demo-amerbagh@example.invalid",
        location: "Amer Road, Jaipur",
        quotationAmount: 29e4,
        bookingStatus: "Shortlisted",
        paymentStatus: "Unpaid",
        serviceQualityScore: 4,
        eventCompatibilityScore: 4,
        availabilityStatus: "Tentative",
        negotiationNotes: "DEMO DATA: Larger lawn but requires external tenting and generator rental (+\u20B945,000).",
        isSampleDemoData: true
      },
      {
        id: "jw-v3",
        name: "Govindam Royal Marwari Rasoi [SAMPLE DEMO VENDOR]",
        category: "Caterers",
        contactName: "Chef Govind Sharma (Demo)",
        contactEmailOrPhone: "demo-rasoi@example.invalid",
        location: "MI Road, Jaipur",
        quotationAmount: 282e3,
        bookingStatus: "Booked",
        paymentStatus: "Deposit Paid",
        serviceQualityScore: 5,
        eventCompatibilityScore: 5,
        availabilityStatus: "Available",
        negotiationNotes: "DEMO DATA: Specializes in pure veg & strict Jain heritage thalis + live chaat street.",
        isSampleDemoData: true
      },
      {
        id: "jw-v4",
        name: "Pink City Gourmet Caterers [SAMPLE DEMO VENDOR]",
        category: "Caterers",
        contactName: "Nitin Agarwal (Demo)",
        contactEmailOrPhone: "",
        location: "C-Scheme, Jaipur",
        quotationAmount: 315e3,
        bookingStatus: "Researching",
        paymentStatus: "Unpaid",
        serviceQualityScore: 4,
        eventCompatibilityScore: 3,
        availabilityStatus: "Unknown",
        negotiationNotes: "",
        isSampleDemoData: true
      },
      {
        id: "jw-v5",
        name: "Utsav Botanical & Brass Studio [SAMPLE DEMO VENDOR]",
        category: "Decorators",
        contactName: "Priya Rathore (Demo)",
        contactEmailOrPhone: "demo-utsav@example.invalid",
        location: "Johari Bazar, Jaipur",
        quotationAmount: 118e3,
        bookingStatus: "Booked",
        paymentStatus: "Deposit Paid",
        serviceQualityScore: 5,
        eventCompatibilityScore: 5,
        availabilityStatus: "Available",
        negotiationNotes: "DEMO DATA: Uses zero floral foam, local Phool Mandi marigolds, and heirloom brass urlis.",
        isSampleDemoData: true
      },
      {
        id: "jw-v6",
        name: "Lightroom Stories Collective [SAMPLE DEMO VENDOR]",
        category: "Photographers",
        contactName: "Siddharth & Tara (Demo)",
        contactEmailOrPhone: "demo-stories@example.invalid",
        location: "Jaipur / Delhi",
        quotationAmount: 75e3,
        bookingStatus: "Booked",
        paymentStatus: "Deposit Paid",
        serviceQualityScore: 5,
        eventCompatibilityScore: 5,
        availabilityStatus: "Available",
        negotiationNotes: "DEMO DATA: Candid documentary coverage + 4-minute Super8 style wedding film.",
        isSampleDemoData: true
      }
    ],
    guests: [
      {
        id: "jw-g1",
        fullName: "Dr. Rameshwar & Sunita Sharma [DEMO]",
        group: "Bride Family",
        invitationSent: true,
        rsvpStatus: "Confirmed",
        attendingCount: 4,
        dietaryPreferences: "Pure Vegetarian (Low Spice)",
        notes: "Ground floor suite requested for senior mobility",
        isDemoData: true
      },
      {
        id: "jw-g2",
        fullName: "Mahaveer & Kavita Jain Family [DEMO]",
        group: "Groom Family",
        invitationSent: true,
        rsvpStatus: "Confirmed",
        attendingCount: 5,
        dietaryPreferences: "Strict Jain Vegetarian",
        notes: "Arriving via Shatabdi Express at 10:30 AM",
        isDemoData: true
      },
      {
        id: "jw-g3",
        fullName: "Vikramaditya & Neha Singhania [DEMO]",
        group: "Close Friends",
        invitationSent: true,
        rsvpStatus: "Confirmed",
        attendingCount: 2,
        dietaryPreferences: "Vegetarian",
        notes: "Performing in Sangeet group dance",
        isDemoData: true
      },
      {
        id: "jw-g4",
        fullName: "An\u093F\u0930\u0941\u0926\u094D\u0927 & Pooja Deshmukh [DEMO]",
        group: "Colleagues",
        invitationSent: true,
        rsvpStatus: "Pending",
        attendingCount: 2,
        dietaryPreferences: "Vegetarian",
        notes: "Awaiting flight confirmation from Mumbai",
        isDemoData: true
      },
      {
        id: "jw-g5",
        fullName: "Karan & Divya Malhotra [DEMO]",
        group: "Close Friends",
        invitationSent: true,
        rsvpStatus: "Declined",
        attendingCount: 0,
        dietaryPreferences: "None",
        notes: "Attending virtually from London",
        isDemoData: true
      }
    ],
    ideas: [
      {
        id: "jw-i1",
        title: "Phoolon Ki Holi & Eco-Marigold Petal Cannon",
        category: "Memorable experiences",
        description: "Replace synthetic confetti cannons with woven bamboo baskets of fragrant desi rose and marigold petals showered from the upper haveli jharokha balconies during Varmala.",
        culturalContext: "Inspired by Braj & Rajasthani courtyard temple celebrations; 100% biodegradable.",
        estimatedCost: 6500,
        isSaved: true,
        isFavorite: true
      },
      {
        id: "jw-i2",
        title: "Live Artisanal Lac Bangle & Ittar Bar",
        category: "Guest activities",
        description: "Invite a traditional Jaipur Maniharo (lac bangle craftsman) and a Kannauj natural ittar perfumer to craft custom wedding favors for guests during the afternoon Mehendi.",
        culturalContext: "Supports local Jaipur craft heritage while giving guests a meaningful handmade keepsake.",
        estimatedCost: 12e3,
        isSaved: true,
        isFavorite: true
      },
      {
        id: "jw-i3",
        title: "Clay Kulhad Kesar Badam Milk & Jalebi-Rabri Cart",
        category: "Food",
        description: "A glowing brass cauldron simmering saffron-almond milk served in terracotta kulhads alongside crisp hot jalebis during the chilly December starlight phere.",
        culturalContext: "Classic North Indian winter wedding hospitality.",
        estimatedCost: 9500,
        isSaved: true,
        isFavorite: false
      },
      {
        id: "jw-i4",
        title: "Zero-Foam Reusable Cane & Brass Mandap Architecture",
        category: "Sustainable event practices",
        description: "Construct the mandap using draped handloom mulmul fabric, cane pillars, and suspended brass bells\u2014zero single-use plastic or toxic floral oasis foam.",
        culturalContext: "Eco-conscious Indian heritage craftsmanship.",
        estimatedCost: 15e3,
        isSaved: true,
        isFavorite: false
      }
    ],
    momentMap: [
      {
        stage: "Arrival",
        desiredExperience: "Effortless, unhurried royal arrival where travel fatigue melts away immediately.",
        activities: [
          "Shuttle drop-off at sandstone Suraj Pol gate",
          "Luggage tag & direct room key handover for outstation elders"
        ],
        preparationRequirements: ["2 shuttle coordinators with guest manifest", "Directional brass easel signage"],
        responsiblePerson: "Rohan (Logistics Lead)",
        estimatedExpense: 18e3,
        potentialIssues: "Old city narrow lane congestion if buses arrive simultaneously.",
        backupArrangements: "Use 2 nimble 14-seater Tempo Travellers staggered by 20 minutes + golf carts for the final 100m."
      },
      {
        stage: "Welcome",
        desiredExperience: 'Warm sensory immersion into Rajasthani hospitality ("Padharo Mhare Desh").',
        activities: [
          "Live Manganiyar kamaicha & dholak welcome melody",
          "Rosewater mist, sandalwood tilak, and fresh mogra wrist gajras"
        ],
        preparationRequirements: ["Chilled & warm welcome beverages ready", "4 hospitality hosts at inner archway"],
        responsiblePerson: "Ananya & Bride Family Hosts",
        estimatedExpense: 12e3,
        potentialIssues: "Queue buildup if 60+ guests step off shuttles at once.",
        backupArrangements: "Split welcome into two parallel archways with roaming tray servers."
      },
      {
        stage: "First impressions",
        desiredExperience: "Awe-inspiring reveal of the central courtyard bathed in amber light and marigold fragrance.",
        activities: [
          "Walkway along floating brass urlis and terracotta diyas",
          "Acoustic vista of the sandstone jharokha balconies"
        ],
        preparationRequirements: ["Light all 120 diyas 25 minutes before sunset", "Keep central sightline clear of cables"],
        responsiblePerson: "Priya (Lead Decorator)",
        estimatedExpense: 38e3,
        potentialIssues: "Evening breeze extinguishing open oil diyas.",
        backupArrangements: "Use hurricane glass cylinders around brass lamps + warm LED micro-diyas in high-wind corners."
      },
      {
        stage: "Social interaction",
        desiredExperience: "Joyful, cross-generational mingling where both families bond effortlessly.",
        activities: [
          "Live lac bangle craft station & sandalwood ittar bar",
          "Passed Palak Patta Chaat & Dahi Puri bites with acoustic folk fusion"
        ],
        preparationRequirements: ["Low charpai & bolster lounge seating clusters for elders", "High-top tables for friends"],
        responsiblePerson: "Kabir (Hospitality Lead)",
        estimatedExpense: 24e3,
        potentialIssues: "Elders feeling overwhelmed by loud speaker volume.",
        backupArrangements: "Position directional speakers toward the dance zone; keep veranda lounge at 65dB conversational level."
      },
      {
        stage: "Main celebration",
        desiredExperience: "Deeply emotional, visible, and inclusive Varmala & Starlight Phere ceremony.",
        activities: [
          "Bride entry under phoolon ki chadar with live folk vocals",
          "Bilingual ritual storytelling so every guest follows the meaning of the 7 vows"
        ],
        preparationRequirements: ["Circular amphitheater-style seating around the mandap", "Bilingual ceremony cards on seats"],
        responsiblePerson: "Pandit Ji & Ceremony Coordinator",
        estimatedExpense: 8e4,
        potentialIssues: "December night chill during 75-minute phere ceremony.",
        backupArrangements: "Distribute warm pashmina shawls and position 8 silent patio heaters around outer seating rings."
      },
      {
        stage: "Highlight moment",
        desiredExperience: "Goosebump-inducing collective celebration as the couple completes their vows.",
        activities: [
          "Shower of 50kg fragrant rose & marigold petals from upper haveli balconies",
          "Synchronized dhol & folk crescendo with sparkler fountain path"
        ],
        preparationRequirements: ["8 cousins stationed on upper jharokhas with petal baskets", "Cold-spark safety clearance"],
        responsiblePerson: "Siddharth (Lead Photographer) & Cousins",
        estimatedExpense: 15e3,
        potentialIssues: "Timing mismatch between priest final blessing and balcony petal drop.",
        backupArrangements: "Assign a walkie-talkie cue from stage manager to balcony team."
      },
      {
        stage: "Food and entertainment",
        desiredExperience: "Unhurried royal dining paired with heartfelt family toasts and joyful dancing.",
        activities: [
          "Sit-down silver thali service for elders + interactive Rajasthani & Jain live counters",
          "Hot kulhad Kesar Badam milk & Jalebi-Rabri cart under the stars"
        ],
        preparationRequirements: ["Dedicated table butlers for senior family tables", "Clearly marked Jain counter"],
        responsiblePerson: "Chef Govind & Catering Captain",
        estimatedExpense: 282e3,
        potentialIssues: "Long buffet lines right after Varmala.",
        backupArrangements: "Open 2 mirror-image buffet lines simultaneously + table-served thalis for the first 50 senior guests."
      },
      {
        stage: "Farewell",
        desiredExperience: "Heartfelt, lingering goodbye that leaves every guest feeling cherished.",
        activities: [
          "Handover of Jaipur Blue Pottery boxes filled with homemade besan laddoos & handwritten thank-you note",
          "Coordinated shuttle departure announcements"
        ],
        preparationRequirements: ["Favor table organized by family group at exit pol", "Valet & shuttle drivers on standby"],
        responsiblePerson: "Aarav & Meera\u2019s Parents",
        estimatedExpense: 13500,
        potentialIssues: "Guests forgetting favor boxes at dining tables.",
        backupArrangements: "Present favor boxes personally at the farewell arch as guests depart."
      }
    ],
    copilotHistory: [
      {
        id: "jw-m1",
        role: "assistant",
        content: "Welcome to GatherOS! I have loaded Aarav & Meera\u2019s Heritage Jaipur Wedding (180 guests \xB7 \u20B98,50,000 target budget \xB7 Dec 18, 2026). Right now, your actual + committed spend is \u20B98,44,000\u2014leaving \u20B96,000 in unallocated headroom plus your \u20B920,000 Emergency Reserve. Ask me anything about optimizing costs, adjusting guest counts, refining your vegetarian/Jain menu, or preparing your winter courtyard backup plan.",
        timestamp: "2026-10-30T09:00:00Z",
        reasoning: "Grounded in active Jaipur Wedding demo state (180 guests, \u20B98,50,000 target budget, 10 budget categories).",
        aiMode: "live"
      }
    ]
  },
  {
    id: "demo-botanical-birthday",
    name: "Elena\u2019s 40th Botanical Twilight Soir\xE9e",
    category: "birthday",
    date: "2026-11-21",
    location: "San Francisco Conservatory & Glasshouse",
    guestCount: 65,
    targetBudget: 14500,
    currency: "USD",
    currencySymbol: "$",
    preferredTheme: "Mediterranean Olive Grove & Candlelit Glasshouse",
    culturalPreferences: "Californian-Mediterranean farm-to-table communal feast with vinyl jazz & storytelling toasts",
    mustHaveExperiences: "Botanical aperitivo bar, long communal linen table, live upright bass jazz trio, custom Polaroid guestbook",
    restrictionsOrRequirements: "Gluten-free and vegan main course options required; glasshouse acoustic limit 85dB",
    planningPriorities: ["Food and catering", "Venue", "Entertainment"],
    birthdaySpecifics: {
      ageGroup: "40th Milestone Celebration (Adults 30\u201365)",
      birthdayTheme: "Botanical Glasshouse & Taper Candlelight Dinner",
      entertainmentPreferences: "Live acoustic jazz trio during aperitivo + vinyl soul DJ set after dinner",
      foodPreferences: "Family-style seasonal Californian-Mediterranean platters, natural wines & botanical non-alcoholic spritzes"
    },
    isDemo: true,
    blueprint: {
      eventConcept: "An intimate 65-guest candlelit dinner inside a historic Victorian botanical glasshouse, where two long olive-draped communal tables, farm-to-table Mediterranean platters, and warm upright-bass jazz create an unforgettable 40th milestone evening.",
      personalizedTheme: "Botanical Glasshouse & Amber Taper Light",
      colorPalette: [
        { name: "Conservatory Fern", hex: "#1B4332", usage: "Menu typography, linen napkins & botanical signage" },
        { name: "Warm Travertine Cream", hex: "#FAF8F5", usage: "Tablecloths, handmade deckle-edge place cards" },
        { name: "Beeswax Amber", hex: "#C5A059", usage: "80 tapered beeswax candles & brass holders" },
        { name: "Fig & Pinot Noir", hex: "#5C2C35", usage: "Floral accents, figs & grape clusters on table" }
      ],
      decorationRecommendations: [
        "Run two continuous 36-foot raw linen tables down the glasshouse nave surrounded by existing tropical palms.",
        "Style tables with potted olive branches, fresh figs, rosemary sprigs, and 80 dripless beeswax taper candles in brass holders."
      ],
      venueConsiderations: [
        "Glasshouse naturally maintains 68\xB0F warmth against San Francisco evening fog.",
        "Use uplighting on exterior glass arches so the conservatory glows like a jewel box as guests walk up."
      ],
      foodAndCateringRecommendations: [
        "Family-style Mediterranean feast: Whipped ricotta with charred sourdough, wood-roasted sea bass, saffron cauliflower steak (vegan/GF), and olive oil citrus cake.",
        "Dedicated Botanical Spritz Cart featuring rosemary-grapefruit zero-proof aperitifs alongside Sonoma pinot noir."
      ],
      entertainmentSuggestions: [
        "Acoustic jazz trio (upright bass, brushed drums, hollow-body guitar) for the first 2 hours.",
        '40th Milestone "Decade Toast" roast & storytelling segment between main course and dessert.'
      ],
      guestExperienceIdeas: [
        "Calligraphed place cards with a personal 1-sentence memory connecting Elena to each guest.",
        "Vintage medium-format instant camera station where guests clip a portrait and write a wish for Elena\u2019s next decade."
      ],
      vendorCategoriesNeeded: ["Venues", "Caterers", "Decorators", "Photographers", "DJs and entertainers"],
      priorityChecklist: [
        "Confirm Glasshouse permit & acoustic load-in window",
        "Lock family-style menu with GF/Vegan platter counts",
        "Order beeswax taper candles and glass hurricane chimneys (fire code compliance)"
      ],
      riskAndContingency: [
        "Open-flame fire code restriction inside historic glasshouse: Enclose all taper candles in tall borosilicate glass hurricane sleeves.",
        "San Francisco coastal rain during arrival walk: Provide clear bubble umbrellas at valet drop-off."
      ],
      personalizedRecommendations: [
        "Using potted herbs and olive trees as centerpieces cuts cut-flower waste by 60% and lets guests take living plants home."
      ],
      whyItMatches: "Tailored for 65 adult guests within $14,500: invests 62% of the budget into the glasshouse setting and extraordinary family-style food/wine while keeping decor organic and low-waste."
    },
    budgetItems: [
      {
        id: "bb-b1",
        category: "Venue",
        title: "Botanical Glasshouse Evening Buyout & Lighting Permit",
        allocatedAmount: 3800,
        plannedAmount: 3800,
        vendorQuotationAmount: 3800,
        actualAmount: 3800,
        paidAmount: 3800,
        isCommitted: true,
        isAiEstimate: false
      },
      {
        id: "bb-b2",
        category: "Food and catering",
        title: "Farm-to-Table Family Platter Dinner & Botanical Spritz Bar (65 Guests)",
        allocatedAmount: 5400,
        plannedAmount: 5500,
        vendorQuotationAmount: 5450,
        actualAmount: 5450,
        paidAmount: 2725,
        isCommitted: true,
        isAiEstimate: false
      },
      {
        id: "bb-b3",
        category: "Decoration",
        title: "Linen Table Rentals, 80 Beeswax Hurricanes & Olive/Fig Styling",
        allocatedAmount: 1600,
        plannedAmount: 1600,
        vendorQuotationAmount: 1550,
        actualAmount: 1550,
        paidAmount: 800,
        isCommitted: true,
        isAiEstimate: true,
        estimateAssumptions: "Includes tall glass hurricane sleeves required by venue fire marshal."
      },
      {
        id: "bb-b4",
        category: "Entertainment",
        title: "Live Upright Bass Jazz Trio + Vinyl Soul DJ Set",
        allocatedAmount: 1400,
        plannedAmount: 1400,
        vendorQuotationAmount: 1400,
        actualAmount: 1400,
        paidAmount: 700,
        isCommitted: true,
        isAiEstimate: false
      },
      {
        id: "bb-b5",
        category: "Photography",
        title: "Candid 35mm Film & Digital Evening Photographer (4 Hours)",
        allocatedAmount: 1100,
        plannedAmount: 1100,
        vendorQuotationAmount: 1100,
        actualAmount: 1100,
        paidAmount: 550,
        isCommitted: true,
        isAiEstimate: false
      },
      {
        id: "bb-b6",
        category: "Miscellaneous",
        title: "Polaroid Film Packs, Linen Guestbook & Potted Herb Favors",
        allocatedAmount: 500,
        plannedAmount: 500,
        vendorQuotationAmount: 480,
        actualAmount: 480,
        paidAmount: 480,
        isCommitted: true,
        isAiEstimate: false
      },
      {
        id: "bb-b7",
        category: "Emergency reserve",
        title: "Contingency Buffer (5%)",
        allocatedAmount: 700,
        plannedAmount: 700,
        vendorQuotationAmount: 0,
        actualAmount: 0,
        paidAmount: 0,
        isCommitted: false,
        isAiEstimate: true
      }
    ],
    timelineTasks: [
      {
        id: "bb-t1",
        title: "Confirm Final Dietary Breakdown (Vegan / Gluten-Free Seats)",
        milestoneCategory: "Catering finalization",
        dueDate: "2026-11-05",
        priority: "High",
        status: "In Progress",
        assignedPerson: "Elena",
        progress: 80
      },
      {
        id: "bb-t2",
        title: "Write 65 Personal 1-Sentence Memory Place Cards",
        milestoneCategory: "Decoration planning",
        dueDate: "2026-11-12",
        priority: "Medium",
        status: "Pending",
        assignedPerson: "Elena & Marcus",
        progress: 35
      },
      {
        id: "bb-t3",
        title: "Coordinate Decade Toast Speakers (3 Friends \xD7 3 Minutes)",
        milestoneCategory: "Preparation milestone",
        dueDate: "2026-11-15",
        priority: "Medium",
        status: "Completed",
        assignedPerson: "Claire (Co-Host)",
        progress: 100
      }
    ],
    vendors: [
      {
        id: "bb-v1",
        name: "Golden Gate Glasshouse Atrium [SAMPLE DEMO VENDOR]",
        category: "Venues",
        contactName: "Hannah Vance (Demo)",
        contactEmailOrPhone: "demo-glasshouse@example.invalid",
        location: "San Francisco, CA",
        quotationAmount: 3800,
        bookingStatus: "Booked",
        paymentStatus: "Paid in Full",
        serviceQualityScore: 5,
        eventCompatibilityScore: 5,
        availabilityStatus: "Available",
        negotiationNotes: "DEMO DATA: Includes architectural uplighting and coat check.",
        isSampleDemoData: true
      },
      {
        id: "bb-v2",
        name: "Nopa Fig & Olive Kitchen [SAMPLE DEMO VENDOR]",
        category: "Caterers",
        contactName: "Chef Mateo Silva (Demo)",
        contactEmailOrPhone: "demo-figolive@example.invalid",
        location: "San Francisco, CA",
        quotationAmount: 5450,
        bookingStatus: "Booked",
        paymentStatus: "Deposit Paid",
        serviceQualityScore: 5,
        eventCompatibilityScore: 5,
        availabilityStatus: "Available",
        negotiationNotes: "DEMO DATA: Family-style platters + zero-proof botanical aperitivo bar.",
        isSampleDemoData: true
      }
    ],
    guests: [
      {
        id: "bb-g1",
        fullName: "Claire & Julian Vance [DEMO]",
        group: "College Friends",
        invitationSent: true,
        rsvpStatus: "Confirmed",
        attendingCount: 2,
        dietaryPreferences: "Gluten-Free (Julian)",
        isDemoData: true
      },
      {
        id: "bb-g2",
        fullName: "Maya Lin-Reyes [DEMO]",
        group: "Design Studio",
        invitationSent: true,
        rsvpStatus: "Confirmed",
        attendingCount: 1,
        dietaryPreferences: "Vegan",
        isDemoData: true
      }
    ],
    ideas: [
      {
        id: "bb-i1",
        title: "Personal Memory Place Cards at Every Seat",
        category: "Memorable experiences",
        description: "Each guest unfolds a deckle-edged card at their plate containing a handwritten memory from Elena.",
        culturalContext: "Creates immediate emotional warmth before the first course is served.",
        estimatedCost: 140,
        isSaved: true,
        isFavorite: true
      }
    ],
    momentMap: [
      {
        stage: "Arrival",
        desiredExperience: "Stepping out of cool San Francisco twilight fog into a warm, glowing glasshouse sanctuary.",
        activities: ["Coat check & umbrella valet", "Warm herb-scented towel handover"],
        preparationRequirements: ["Exterior pathway lanterns lit by 5:30 PM"],
        responsiblePerson: "Marcus",
        estimatedExpense: 200,
        potentialIssues: "Coastal drizzle during walk from drop-off.",
        backupArrangements: "20 clear architectural umbrellas stationed with greeters."
      },
      {
        stage: "Welcome",
        desiredExperience: "Immediate glass-in-hand botanical spritz and effortless mingling.",
        activities: ["Rosemary-grapefruit spritz & Sonoma sparkling pour", "Polaroid portrait snapshot"],
        preparationRequirements: ["Pre-poured welcome trays at atrium entrance"],
        responsiblePerson: "Lead Bartender",
        estimatedExpense: 650,
        potentialIssues: "Bottleneck at the Polaroid guestbook table.",
        backupArrangements: "Provide 2 instant cameras and a dedicated friend photographer during the first 40 minutes."
      },
      {
        stage: "First impressions",
        desiredExperience: "Gasps as the glasshouse inner doors open to reveal 80 flickering beeswax candles under giant ferns.",
        activities: ["Candlelit communal table reveal", "Acoustic upright bass trio playing warm bossa nova"],
        preparationRequirements: ["All 80 candles lit 15 minutes before doors open"],
        responsiblePerson: "Claire",
        estimatedExpense: 1550,
        potentialIssues: "Draft from atrium doors flickering candles.",
        backupArrangements: "Tall borosilicate hurricane cylinders shield every flame."
      },
      {
        stage: "Social interaction",
        desiredExperience: "Spirited table conversation sparked by handwritten memory place cards.",
        activities: ["Guests discover their personal memory card at their seat", "Sharedmezze platters passed family-style"],
        preparationRequirements: ["Alphabetical seating chart easel + table host assignments"],
        responsiblePerson: "Elena",
        estimatedExpense: 180,
        potentialIssues: "Guests struggling to find their seat along a 36-foot table.",
        backupArrangements: "Numbered table zones (Zones A\u2013D) clearly indicated on the entryway chart."
      },
      {
        stage: "Main celebration",
        desiredExperience: "Abundant, unhurried Mediterranean feast where plates and wine glasses stay full.",
        activities: ["3-wave family-style platter service", "Curated natural wine & botanical pairing explanation by chef"],
        preparationRequirements: ["Color-coded ceramic platters for Vegan/GF dishes"],
        responsiblePerson: "Chef Mateo",
        estimatedExpense: 4800,
        potentialIssues: "Platters cooling down on long tables.",
        backupArrangements: "Serve in pre-warmed stoneware dishes in two synchronized kitchen waves."
      },
      {
        stage: "Highlight moment",
        desiredExperience: 'Laughter and happy tears during the 3-friend "Four Decades of Elena" storytelling toasts.',
        activities: ["3 curated 3-minute stories", "Candlelit Olive Oil Citrus Cake presentation"],
        preparationRequirements: ["Wireless handheld mic tested for glasshouse reverb"],
        responsiblePerson: "Claire",
        estimatedExpense: 0,
        potentialIssues: "Impromptu speeches running too long.",
        backupArrangements: "Claire emcees with a warm, structured 12-minute toast window before music rises."
      },
      {
        stage: "Food and entertainment",
        desiredExperience: "Espresso martinis, vinyl soul classics, and joyful barefoot-friendly dancing under the palms.",
        activities: ["All-vinyl 70s/80s soul & disco set", "Late-night artisanal dark chocolate & espresso bar"],
        preparationRequirements: ["85dB directional speaker limit observed"],
        responsiblePerson: "DJ Julian",
        estimatedExpense: 1400,
        potentialIssues: "Glasshouse humidity rising during dancing.",
        backupArrangements: "Open upper conservatory clerestory vents by 20% at 9:15 PM."
      },
      {
        stage: "Farewell",
        desiredExperience: "Guests leave with a living rosemary/olive terracotta pot and warm embrace.",
        activities: ["Take-home terracotta herb pots from table centerpieces", "Rideshare pickup lounge"],
        preparationRequirements: ["Kraft paper sleeves ready to wrap centerpieces cleanly"],
        responsiblePerson: "Marcus & Claire",
        estimatedExpense: 300,
        potentialIssues: "Soil spills in rideshares.",
        backupArrangements: "Pre-wrap each terracotta pot in waxed linen carry bags with handles."
      }
    ],
    copilotHistory: [
      {
        id: "bb-m1",
        role: "assistant",
        content: "Elena\u2019s 40th Botanical Twilight Soir\xE9e is on track for 65 guests with $13,780 allocated out of your $14,500 budget ($720 remaining buffer). Would you like to refine your vegan/GF menu pairings or test what happens if 15 more friends RSVP?",
        timestamp: "2026-10-30T09:05:00Z",
        aiMode: "live"
      }
    ]
  },
  {
    id: "demo-community-festival",
    name: "Oakwood Autumn Harvest & Makers Festival",
    category: "community",
    date: "2026-11-14",
    location: "Oakwood Civic Plaza & Heritage Park, Portland",
    guestCount: 450,
    targetBudget: 28e3,
    currency: "USD",
    currencySymbol: "$",
    preferredTheme: "Zero-Waste Pacific Northwest Harvest & Civic Commons",
    culturalPreferences: "Inclusive multi-generational neighbourhood gathering celebrating local farmers, ceramicists, and folk musicians",
    mustHaveExperiences: "Community cider press, 25 local maker booths, acoustic timber stage, kids botanical print workshop, zero-waste dishwashing station",
    restrictionsOrRequirements: "100% compostable/reusable serviceware; ADA wheelchair accessible pathways; civic park permit compliance",
    planningPriorities: ["Venue", "Entertainment", "Guest experience"],
    communitySpecifics: {
      eventPurpose: "Annual neighbourhood cultural cohesion, local small-business showcase & community garden fundraiser",
      targetAudience: "450 local families, seniors, artists, and neighbourhood residents",
      communitySize: "450 expected attendees + 35 local makers/volunteers",
      activities: "Live cider pressing, acoustic folk stage, children\u2019s leaf-printing craft tent, long-table harvest soup share",
      sponsorsOrVolunteers: "42 registered neighbourhood volunteers + $8,500 in local credit union & bakery sponsorships"
    },
    isDemo: true,
    blueprint: {
      eventConcept: "A warm, zero-waste neighbourhood harvest festival in Oakwood Civic Plaza that unites 450 residents around a live community apple cider press, 25 local artisan booths, an acoustic timber stage, and a communal autumn soup table.",
      personalizedTheme: "Pacific Northwest Cedar, Canvas & Harvest Gold",
      colorPalette: [
        { name: "Douglas Fir Green", hex: "#1B4332", usage: "Volunteer aprons, wayfinding banners & stage scrim" },
        { name: "Unbleached Canvas", hex: "#FAF8F5", usage: "Maker booth canopies & signage background" },
        { name: "Harvest Cider Amber", hex: "#C5A059", usage: "Festival tokens, bunting & stage lighting" },
        { name: "Roasted Chestnut", hex: "#6B3E26", usage: "Timber benches & artisan stall frames" }
      ],
      decorationRecommendations: [
        "String reusable hand-stitched linen bunting across the civic plaza sycamore trees.",
        "Use hay bales and wooden apple crates borrowed from partner orchards as modular amphitheater seating (returned post-event)."
      ],
      venueConsiderations: [
        "Arrange booths in a horseshoe layout around the central fountain so foot traffic flows naturally past all 25 makers.",
        "Maintain 12-foot clear emergency & wheelchair lanes across all paved paths."
      ],
      foodAndCateringRecommendations: [
        "Partner with 4 neighbourhood food artisans (wood-fired flatbreads, harvest squash soup, hot spiced apple cider, sourdough pastries).",
        "Deploy a Volunteer Dishwashing & Reusable Enamel Mug Station to achieve 98% landfill diversion."
      ],
      entertainmentSuggestions: [
        "Rotating 45-minute sets by 4 local acoustic folk, bluegrass, and youth choir ensembles.",
        "Interactive heritage apple cider pressing every hour on the hour."
      ],
      guestExperienceIdeas: [
        'Issue wooden "Oakwood Harvest Tokens" at the welcome booth and kids\u2019 passport stamp cards for visiting local makers.'
      ],
      vendorCategoriesNeeded: ["Venues", "Caterers", "Decorators", "DJs and entertainers", "Transportation"],
      priorityChecklist: [
        "Secure City Parks Special Event Permit & Certificate of Insurance",
        "Assign 42 volunteers across 3 two-hour shifts (Setup, Welcome/Zero-Waste Station, Breakdown)",
        "Confirm solar battery generator delivery for the acoustic stage and cider press"
      ],
      riskAndContingency: [
        "Pacific Northwest November rain shower: Erect 3 linked 20x40ft heavy-duty canvas pavilion tents over the central dining & stage commons."
      ],
      personalizedRecommendations: [
        "Using reusable enamel mugs with a $2 refundable token deposit eliminates 1,200 disposable cups and doubles as a beloved festival souvenir."
      ],
      whyItMatches: "Built for a 450-person civic community festival on a $28,000 budget: prioritizes safety permits, weatherproof canvas shelters, reusable zero-waste infrastructure, and volunteer shift orchestration."
    },
    budgetItems: [
      {
        id: "cf-b1",
        category: "Venue",
        title: "Civic Plaza Permit, Insurance, ADA Restrooms & 3 Canvas Weather Pavilions",
        allocatedAmount: 8200,
        plannedAmount: 8200,
        vendorQuotationAmount: 8100,
        actualAmount: 8100,
        paidAmount: 6e3,
        isCommitted: true,
        isAiEstimate: false
      },
      {
        id: "cf-b2",
        category: "Food and catering",
        title: "Communal Harvest Soup Kitchen, Cider Press Apples & Volunteer Meals (450 Attendees)",
        allocatedAmount: 6800,
        plannedAmount: 6800,
        vendorQuotationAmount: 6600,
        actualAmount: 6600,
        paidAmount: 3e3,
        isCommitted: true,
        isAiEstimate: false
      },
      {
        id: "cf-b3",
        category: "Entertainment",
        title: "Solar Acoustic Stage PA, Sound Engineer & 4 Local Ensemble Stipends",
        allocatedAmount: 4200,
        plannedAmount: 4200,
        vendorQuotationAmount: 4200,
        actualAmount: 4200,
        paidAmount: 2100,
        isCommitted: true,
        isAiEstimate: false
      },
      {
        id: "cf-b4",
        category: "Decoration",
        title: "Reusable Canvas Booth Headers, Timber Wayfinding Signs & Orchard Crate Rental",
        allocatedAmount: 2900,
        plannedAmount: 2900,
        vendorQuotationAmount: 2800,
        actualAmount: 2800,
        paidAmount: 1400,
        isCommitted: true,
        isAiEstimate: false
      },
      {
        id: "cf-b5",
        category: "Miscellaneous",
        title: "Zero-Waste Enamel Mug Wash Station & Kids Botanical Craft Supplies",
        allocatedAmount: 2400,
        plannedAmount: 2400,
        vendorQuotationAmount: 2350,
        actualAmount: 2350,
        paidAmount: 2350,
        isCommitted: true,
        isAiEstimate: false
      },
      {
        id: "cf-b6",
        category: "Photography",
        title: "Community Documentary Photographer & Drone Plaza Aerials",
        allocatedAmount: 1200,
        plannedAmount: 1200,
        vendorQuotationAmount: 1200,
        actualAmount: 1200,
        paidAmount: 600,
        isCommitted: true,
        isAiEstimate: false
      },
      {
        id: "cf-b7",
        category: "Emergency reserve",
        title: "Rain Sidewall & Safety Contingency Reserve",
        allocatedAmount: 2300,
        plannedAmount: 2300,
        vendorQuotationAmount: 0,
        actualAmount: 0,
        paidAmount: 0,
        isCommitted: false,
        isAiEstimate: true
      }
    ],
    timelineTasks: [
      {
        id: "cf-t1",
        title: "File Civic Plaza Special Event & Sound Permit with City Parks",
        milestoneCategory: "Booking deadline",
        dueDate: "2026-09-25",
        priority: "High",
        status: "Completed",
        assignedPerson: "David (Festival Chair)",
        progress: 100
      },
      {
        id: "cf-t2",
        title: "Distribute Booth Map & Load-In Schedule to 25 Local Makers",
        milestoneCategory: "Preparation milestone",
        dueDate: "2026-11-01",
        priority: "High",
        status: "In Progress",
        assignedPerson: "Sonia (Maker Lead)",
        progress: 85
      },
      {
        id: "cf-t3",
        title: "Brief 42 Volunteers on Zero-Waste Mug Station & Safety Roles",
        milestoneCategory: "Final event-day preparation",
        dueDate: "2026-11-10",
        priority: "High",
        status: "Pending",
        assignedPerson: "Liam (Volunteer Captain)",
        progress: 40
      }
    ],
    vendors: [
      {
        id: "cf-v1",
        name: "Cascadia Canvas & Solar Staging [SAMPLE DEMO VENDOR]",
        category: "Venues",
        contactName: "Owen Miller (Demo)",
        contactEmailOrPhone: "demo-cascadia@example.invalid",
        location: "Portland, OR",
        quotationAmount: 8100,
        bookingStatus: "Booked",
        paymentStatus: "Deposit Paid",
        serviceQualityScore: 5,
        eventCompatibilityScore: 5,
        availabilityStatus: "Available",
        negotiationNotes: "DEMO DATA: 3 modular rain canopies + silent solar battery bank for stage.",
        isSampleDemoData: true
      }
    ],
    guests: [
      {
        id: "cf-g1",
        fullName: "Oakwood Neighbourhood Association [DEMO]",
        group: "Community Partners",
        invitationSent: true,
        rsvpStatus: "Confirmed",
        attendingCount: 120,
        dietaryPreferences: "Mixed / Vegetarian & Gluten-Free Soup",
        isDemoData: true
      },
      {
        id: "cf-g2",
        fullName: "Willamette Valley Artisan Guild (25 Booths) [DEMO]",
        group: "Makers & Volunteers",
        invitationSent: true,
        rsvpStatus: "Confirmed",
        attendingCount: 45,
        dietaryPreferences: "Vegetarian Boxed Lunches",
        isDemoData: true
      }
    ],
    ideas: [
      {
        id: "cf-i1",
        title: "Refundable Enamel Harvest Mug & Zero-Waste Wash Hub",
        category: "Sustainable event practices",
        description: "Attendees pick up a speckled forest-green enamel mug at entry for hot cider and soup, returning it to the volunteer wash hub or keeping it as a fundraiser keepsake.",
        culturalContext: "Pacific Northwest zero-waste civic tradition.",
        estimatedCost: 1450,
        isSaved: true,
        isFavorite: true
      }
    ],
    momentMap: [
      {
        stage: "Arrival",
        desiredExperience: "Bike-friendly, stroller-accessible, welcoming civic plaza entrance.",
        activities: ["Volunteer bike valet corral", "ADA drop-off zone & stroller parking"],
        preparationRequirements: ["Bike racks for 80 bicycles", "Clear timber wayfinding arch"],
        responsiblePerson: "Liam (Volunteer Captain)",
        estimatedExpense: 400,
        potentialIssues: "Street parking spillover onto residential blocks.",
        backupArrangements: "Partner with Oakwood High School lot 2 blocks away with walking path banners."
      },
      {
        stage: "Welcome",
        desiredExperience: "Warm neighbourhood greeting with festival map and enamel cider mug handover.",
        activities: ["Pick up Oakwood Enamel Mug & Kids Maker Passport", "Volunteer greeters"],
        preparationRequirements: ["2 welcome kiosks at North and South plaza entrances"],
        responsiblePerson: "Sonia",
        estimatedExpense: 1450,
        potentialIssues: "Morning rush at 11:00 AM opening bell.",
        backupArrangements: "Express line for families who pre-registered online."
      },
      {
        stage: "First impressions",
        desiredExperience: "Aroma of freshly pressed apple cider, wood-fired bread, and acoustic fiddle music.",
        activities: ["Central Cider Press in action", "Hand-stitched canvas bunting overhead"],
        preparationRequirements: ["Start first cider press batch at 10:50 AM"],
        responsiblePerson: "Orchard Team",
        estimatedExpense: 900,
        potentialIssues: "Wasp attraction around sweet apple pomace.",
        backupArrangements: "Sealed compost bins emptied every 30 minutes to community garden."
      },
      {
        stage: "Social interaction",
        desiredExperience: "Neighbours meeting makers, children stamping passports, elders chatting on hay-bale lounges.",
        activities: ["25 Maker Booths & Kids Botanical Leaf-Print Tent", "Neighbourhood Story Wall"],
        preparationRequirements: ["12ft wide walkways between booth rows"],
        responsiblePerson: "Sonia",
        estimatedExpense: 950,
        potentialIssues: "Crowding around popular bakery stall.",
        backupArrangements: "Dedicated queue lane along plaza perimeter."
      },
      {
        stage: "Main celebration",
        desiredExperience: "All 450 neighbours gathering around the timber stage for the Harvest Community Toast & Choir.",
        activities: ["Oakwood Youth & Senior Choir joint performance", "Community Garden Fundraiser announcement"],
        preparationRequirements: ["Solar PA mic check at 1:30 PM"],
        responsiblePerson: "David (Festival Chair)",
        estimatedExpense: 4200,
        potentialIssues: "Generator battery dip.",
        backupArrangements: "Dual redundant LiFePO4 solar battery banks on stage."
      },
      {
        stage: "Highlight moment",
        desiredExperience: "Raising 450 warm enamel mugs of fresh-pressed spiced cider together as autumn leaves fall.",
        activities: ["Simultaneous community cider toast", "Group aerial plaza photograph"],
        preparationRequirements: ["200 pre-filled cider mugs on central trestle tables at 2:15 PM"],
        responsiblePerson: "David & Orchard Team",
        estimatedExpense: 1200,
        potentialIssues: "Attendees in back rows unable to hear the toast cue.",
        backupArrangements: "Brass harvest bell rung 3 times before the toast."
      },
      {
        stage: "Food and entertainment",
        desiredExperience: "Long-table harvest squash soup share and afternoon bluegrass jam.",
        activities: ["Communal trestle dining", "Zero-waste volunteer dishwashing hub in action"],
        preparationRequirements: ["3-basin commercial sanitizer sink station"],
        responsiblePerson: "Zero-Waste Crew",
        estimatedExpense: 6600,
        potentialIssues: "Mug return backlog.",
        backupArrangements: "4-person rotating volunteer wash relay."
      },
      {
        stage: "Farewell",
        desiredExperience: "Leave-no-trace sunset wrap-up where surplus bread and soup go to the local shelter.",
        activities: ["Surplus food rescue handoff", "Volunteer appreciation circle"],
        preparationRequirements: ["Insulated food transport containers ready at 5:00 PM"],
        responsiblePerson: "Liam & David",
        estimatedExpense: 200,
        potentialIssues: "Early dusk darkness during maker load-out.",
        backupArrangements: "LED work floodlights powered by solar bank until 6:30 PM."
      }
    ],
    copilotHistory: [
      {
        id: "cf-m1",
        role: "assistant",
        content: "Oakwood Autumn Harvest & Makers Festival is loaded (450 attendees \xB7 $25,250 actual/committed out of $28,000 budget \xB7 42 volunteers). Ask me how to optimize volunteer shifts, prepare for Pacific Northwest rain, or scale food stalls.",
        timestamp: "2026-10-30T09:10:00Z",
        aiMode: "live"
      }
    ]
  }
];

// src/types/gatheros.ts
var ALL_BUDGET_CATEGORIES = [
  "Venue",
  "Food and catering",
  "Decoration",
  "Photography",
  "Entertainment",
  "Transportation",
  "Invitations",
  "Accommodation",
  "Miscellaneous",
  "Emergency reserve"
];
var ALL_MOMENT_STAGES = [
  "Arrival",
  "Welcome",
  "First impressions",
  "Social interaction",
  "Main celebration",
  "Highlight moment",
  "Food and entertainment",
  "Farewell"
];

// src/utils/planningEngine.ts
function calculateBudgetSummary(event) {
  const categoryMap = /* @__PURE__ */ new Map();
  for (const category of ALL_BUDGET_CATEGORIES) {
    categoryMap.set(category, {
      category,
      allocated: 0,
      planned: 0,
      quoted: 0,
      actual: 0,
      paid: 0,
      committed: 0,
      outstanding: 0,
      utilizationPercent: 0,
      isOverAllocated: false
    });
  }
  for (const item of event.budgetItems) {
    const entry = categoryMap.get(item.category) ?? {
      category: item.category,
      allocated: 0,
      planned: 0,
      quoted: 0,
      actual: 0,
      paid: 0,
      committed: 0,
      outstanding: 0,
      utilizationPercent: 0,
      isOverAllocated: false
    };
    entry.allocated += Number(item.allocatedAmount) || 0;
    entry.planned += Number(item.plannedAmount) || 0;
    entry.quoted += Number(item.vendorQuotationAmount) || 0;
    entry.actual += Number(item.actualAmount) || 0;
    entry.paid += Number(item.paidAmount) || 0;
    if (item.isCommitted) {
      entry.committed += Number(item.actualAmount || item.vendorQuotationAmount || item.plannedAmount) || 0;
    }
    categoryMap.set(item.category, entry);
  }
  const categoryBreakdowns = [];
  let totalAllocatedBudget = 0;
  let plannedExpenses = 0;
  let vendorQuotations = 0;
  let actualExpenses = 0;
  let paidExpenses = 0;
  let committedExpenses = 0;
  for (const entry of categoryMap.values()) {
    entry.outstanding = Math.max(0, entry.actual - entry.paid);
    entry.utilizationPercent = entry.allocated > 0 ? Math.round(entry.actual / entry.allocated * 100) : entry.actual > 0 ? 100 : 0;
    entry.isOverAllocated = entry.actual > entry.allocated || entry.planned > entry.allocated;
    totalAllocatedBudget += entry.allocated;
    plannedExpenses += entry.planned;
    vendorQuotations += entry.quoted;
    actualExpenses += entry.actual;
    paidExpenses += entry.paid;
    committedExpenses += entry.committed;
    categoryBreakdowns.push(entry);
  }
  const remainingBudget = totalAllocatedBudget - actualExpenses;
  const targetRemainingBudget = event.targetBudget - actualExpenses;
  const outstandingPayments = Math.max(0, actualExpenses - paidExpenses);
  const utilizationPercentage = totalAllocatedBudget > 0 ? Math.round(actualExpenses / totalAllocatedBudget * 100) : 0;
  const isOverTarget = totalAllocatedBudget > event.targetBudget || actualExpenses > event.targetBudget;
  const isActualExceedingAllocated = actualExpenses > totalAllocatedBudget;
  const warnings = [];
  if (totalAllocatedBudget > event.targetBudget) {
    const diff = totalAllocatedBudget - event.targetBudget;
    warnings.push(
      `Total category allocations exceed your target cap of ${event.currencySymbol}${event.targetBudget.toLocaleString()} by ${event.currencySymbol}${diff.toLocaleString()}.`
    );
  }
  if (actualExpenses > totalAllocatedBudget) {
    const diff = actualExpenses - totalAllocatedBudget;
    warnings.push(
      `Actual recorded expenses exceed your total allocated budget by ${event.currencySymbol}${diff.toLocaleString()}.`
    );
  }
  for (const cat of categoryBreakdowns) {
    if (cat.actual > cat.allocated && cat.allocated > 0) {
      warnings.push(
        `${cat.category} actual spend (${event.currencySymbol}${cat.actual.toLocaleString()}) exceeds its allocation (${event.currencySymbol}${cat.allocated.toLocaleString()}).`
      );
    }
  }
  return {
    targetBudget: event.targetBudget,
    totalAllocatedBudget,
    plannedExpenses,
    vendorQuotations,
    actualExpenses,
    paidExpenses,
    committedExpenses,
    outstandingPayments,
    remainingBudget,
    targetRemainingBudget,
    utilizationPercentage,
    isOverTarget,
    isActualExceedingAllocated,
    warnings,
    categoryBreakdowns
  };
}

// server.ts
dotenv.config();
var PORT = Number(process.env.PORT) || 3e3;
var IS_VERCEL = Boolean(process.env.VERCEL);
var DATA_DIR = IS_VERCEL ? "/tmp/.data" : path.resolve(process.cwd(), ".data");
var DATA_FILE = path.join(DATA_DIR, "gatheros-events.json");
var memoryEventsCache = null;
function getConfiguredApiKey() {
  const raw = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!raw || raw === "MY_GEMINI_API_KEY" || raw.trim() === "") {
    return void 0;
  }
  return raw.trim();
}
function getAiModelName() {
  const configured = process.env.AI_MODEL?.trim();
  if (configured) {
    return configured;
  }
  return "gemini-2.5-flash";
}
function createGenAiClient() {
  const apiKey = getConfiguredApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    ...process.env.AI_BASE_URL ? { httpOptions: { baseUrl: process.env.AI_BASE_URL } } : {}
  });
}
function withTimeout(promise, ms = 8e3) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("AI request timed out")), ms);
    promise.then((val) => {
      clearTimeout(timer);
      resolve(val);
    }).catch((err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}
function loadEventsFromDisk() {
  if (memoryEventsCache && memoryEventsCache.length > 0) {
    return memoryEventsCache;
  }
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial = JSON.parse(JSON.stringify(INITIAL_DEMO_EVENTS));
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), "utf-8");
      memoryEventsCache = initial;
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      memoryEventsCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.error("Error loading persisted events, using initial demo events:", err);
  }
  const fallback = JSON.parse(JSON.stringify(INITIAL_DEMO_EVENTS));
  memoryEventsCache = fallback;
  return fallback;
}
function saveEventsToDisk(events) {
  memoryEventsCache = events;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving persisted events:", err);
  }
}
function buildContextualBlueprintFallback(payload) {
  const name = payload.name || "Bespoke Celebration";
  const category = payload.category || "wedding";
  const location = payload.location || "Jaipur";
  const guestCount = Number(payload.guestCount) || 150;
  const targetBudget = Number(payload.targetBudget) || 5e5;
  const sym = payload.currencySymbol || "\u20B9";
  const theme = payload.preferredTheme || "Warm Editorial Heritage & Candlelight";
  const culture = payload.culturalPreferences || "Heartfelt hospitality & regional culinary traditions";
  const mustHaves = payload.mustHaveExperiences || "Live acoustic welcome, curated dining, memorable farewell keepsakes";
  const restrictions = payload.restrictionsOrRequirements || "Step-free elder access and clear dietary labelling";
  const blueprint = {
    eventConcept: `A tailored ${category} experience in ${location} for ${guestCount} guests ("${name}"), harmonizing ${theme} aesthetics with ${culture} inside a disciplined ${sym}${targetBudget.toLocaleString()} budget.`,
    personalizedTheme: theme,
    colorPalette: [
      { name: "Deep Forest Canopy", hex: "#1B4332", usage: "Primary drapery, welcome signage & table accents" },
      { name: "Warm Alabaster Ivory", hex: "#FAF8F5", usage: "Table linens, architectural canopies & stationery" },
      { name: "Champagne Brass", hex: "#C5A059", usage: "Candleholders, tableware & warm lighting accents" },
      { name: "Spiced Terracotta", hex: "#9E473B", usage: "Seasonal floral highlights & textile borders" }
    ],
    decorationRecommendations: [
      `Anchor the main ${location} venue space with seasonal local botanicals and warm amber uplighting aligned with "${theme}".`,
      "Use reusable brass hurricane lanterns and draped organic cotton/linen to create high visual warmth without disposable plastic props.",
      "Design a focal welcome archway that transitions seamlessly into the main celebration photo backdrop."
    ],
    venueConsiderations: [
      `Select a venue in ${location} comfortable for ${guestCount} guests with both open-air ambiance and an immediate weatherproof indoor hall.`,
      `Strictly enforce requirement: ${restrictions}.`
    ],
    foodAndCateringRecommendations: [
      `Design a multi-sensory menu celebrating ${culture} with live interactive stations for ${guestCount} guests.`,
      `Clearly label all dietary stations (${restrictions}) and provide table service for senior family members.`
    ],
    entertainmentSuggestions: [
      `Open with live acoustic instrumentation during guest arrival, building to curated celebration music and ${mustHaves}.`
    ],
    guestExperienceIdeas: [
      `Incorporate your must-have vision (${mustHaves}) into the Welcome and Highlight stages of the Moment Map.`,
      "Provide personalized welcome notes and locally crafted take-home favors."
    ],
    vendorCategoriesNeeded: [
      "Venues",
      "Caterers",
      "Decorators",
      "Photographers",
      "DJs and entertainers",
      "Transportation",
      "Invitation designers"
    ],
    priorityChecklist: [
      `Lock ${location} venue & weather backup for ${guestCount} guests`,
      `Confirm catering per-plate pricing within ${sym}${Math.round(targetBudget * 0.32 / Math.max(1, guestCount)).toLocaleString()}/guest`,
      `Approve "${theme}" lighting & botanical decor plot`,
      "Send digital RSVP suite and dietary preference form"
    ],
    riskAndContingency: [
      "Weather shift: Keep a 72-hour tenting or indoor hall switch protocol ready at the venue.",
      `Budget protection: Hold 5% (${sym}${Math.round(targetBudget * 0.05).toLocaleString()}) in untouched Emergency Reserve.`
    ],
    personalizedRecommendations: [
      `By concentrating 60% of your ${sym}${targetBudget.toLocaleString()} budget on Venue and Food & Catering, ${guestCount} guests will experience genuine hospitality without overspending on one-time stage props.`
    ],
    whyItMatches: `Specifically calibrated for ${guestCount} guests in ${location} with a ${sym}${targetBudget.toLocaleString()} target budget, honoring "${culture}" and "${restrictions}".`
  };
  const ratios = [
    { category: "Venue", title: `${location} Venue & Weather Backup Buyout`, ratio: 0.28, isAi: true },
    { category: "Food and catering", title: `Curated Catering & Beverage Service (${guestCount} Guests)`, ratio: 0.32, isAi: true },
    { category: "Decoration", title: `${theme} Botanical & Lighting Production`, ratio: 0.13, isAi: true },
    { category: "Photography", title: "Documentary Photography & Highlight Cinema", ratio: 0.09, isAi: true },
    { category: "Entertainment", title: "Live Acoustic Welcome & Celebration Sound/DJ", ratio: 0.06, isAi: true },
    { category: "Accommodation", title: "Out-of-Town Guest Room Block Allocation", ratio: 0.03, isAi: true },
    { category: "Transportation", title: "Scheduled Guest Shuttle Transfers", ratio: 0.02, isAi: true },
    { category: "Invitations", title: "Digital RSVP Suite & Keepsake Stationery", ratio: 0.01, isAi: true },
    { category: "Miscellaneous", title: "Welcome Hospitality Kits & Guest Favors", ratio: 0.01, isAi: true },
    { category: "Emergency reserve", title: "Protected 5% Contingency Reserve", ratio: 0.05, isAi: true }
  ];
  const budgetItems = ratios.map((r, idx) => {
    const amount = Math.round(targetBudget * r.ratio);
    return {
      id: `gen-b-${Date.now()}-${idx}`,
      category: r.category,
      title: r.title,
      allocatedAmount: amount,
      plannedAmount: amount,
      vendorQuotationAmount: 0,
      actualAmount: idx < 2 ? amount : 0,
      paidAmount: idx === 0 ? Math.round(amount * 0.4) : 0,
      isCommitted: idx < 2,
      isAiEstimate: r.isAi,
      estimateAssumptions: `AI estimated at ${Math.round(r.ratio * 100)}% of ${sym}${targetBudget.toLocaleString()} for ${guestCount} guests in ${location}.`
    };
  });
  const eventDateMs = payload.date ? new Date(payload.date).getTime() : Date.now() + 45 * 864e5;
  const makeDate = (daysBefore) => new Date(Math.max(Date.now() + 2 * 864e5, eventDateMs - daysBefore * 864e5)).toISOString().split("T")[0];
  const timelineTasks = [
    {
      id: `gen-t-${Date.now()}-1`,
      title: `Confirm ${location} Venue Contract & Weather Backup Plan`,
      milestoneCategory: "Booking deadline",
      dueDate: makeDate(40),
      priority: "High",
      status: "In Progress",
      assignedPerson: "Lead Organizer",
      progress: 50
    },
    {
      id: `gen-t-${Date.now()}-2`,
      title: `Finalize Menu Tasting & "${restrictions}" Dietary Counter`,
      milestoneCategory: "Catering finalization",
      dueDate: makeDate(28),
      priority: "High",
      status: "Pending",
      assignedPerson: "Catering Coordinator",
      progress: 0
    },
    {
      id: `gen-t-${Date.now()}-3`,
      title: `Send Digital Invitations & Collect RSVPs for ${guestCount} Guests`,
      milestoneCategory: "Invitation deadline",
      dueDate: makeDate(25),
      priority: "High",
      status: "Pending",
      assignedPerson: "Hospitality Lead",
      progress: 0
    },
    {
      id: `gen-t-${Date.now()}-4`,
      title: `Approve "${theme}" Floral, Lighting & Table Layout`,
      milestoneCategory: "Decoration planning",
      dueDate: makeDate(15),
      priority: "Medium",
      status: "Pending",
      assignedPerson: "Design Lead",
      progress: 0
    },
    {
      id: `gen-t-${Date.now()}-5`,
      title: "Distribute Moment Map & Final Headcount to All Vendors",
      milestoneCategory: "Final event-day preparation",
      dueDate: makeDate(3),
      priority: "High",
      status: "Pending",
      assignedPerson: "Lead Organizer",
      progress: 0
    }
  ];
  const ideas = [
    {
      id: `gen-i-${Date.now()}-1`,
      title: `Signature "${theme}" Welcome Ritual`,
      category: "Memorable experiences",
      description: `Greet all ${guestCount} guests with a locally inspired botanical refresher and acoustic welcome melody rooted in ${culture}.`,
      culturalContext: culture,
      estimatedCost: Math.round(targetBudget * 0.015),
      isSaved: true,
      isFavorite: true
    },
    {
      id: `gen-i-${Date.now()}-2`,
      title: "Zero-Foam Seasonal Botanical & Candlelight Tablescape",
      category: "Sustainable event practices",
      description: "Use local seasonal foliage, terracotta/brass vessels, and beeswax candles that guests can take home afterward.",
      culturalContext: "Sustainable luxury design",
      estimatedCost: Math.round(targetBudget * 0.02),
      isSaved: true,
      isFavorite: false
    }
  ];
  const momentMap = ALL_MOMENT_STAGES.map((stage, idx) => ({
    stage,
    desiredExperience: idx === 0 ? `Seamless, welcoming arrival in ${location} with clear wayfinding for all ${guestCount} guests.` : idx === 5 ? `Unforgettable emotional centerpiece featuring ${mustHaves}.` : `Thoughtfully paced ${stage.toLowerCase()} aligned with ${theme}.`,
    activities: [`Curated ${stage.toLowerCase()} touchpoint`, `Hospitality check for ${guestCount} guests`],
    preparationRequirements: [`Brief coordinator 30 mins prior to ${stage}`],
    responsiblePerson: "Event Coordinator",
    estimatedExpense: Math.round(targetBudget * 0.08 / (idx + 1)),
    potentialIssues: "Timing drift or guest bottleneck during transition.",
    backupArrangements: "Stagger flow with two parallel hospitality hosts and clear acoustic cues."
  }));
  return { blueprint, budgetItems, timelineTasks, ideas, momentMap };
}
var app = express();
app.use(express.json({ limit: "5mb" }));
app.get("/api/events", (_req, res) => {
  const events = loadEventsFromDisk();
  res.json({ events });
});
app.post("/api/events", (req, res) => {
  const { event, events: bulkEvents } = req.body;
  if (Array.isArray(bulkEvents)) {
    saveEventsToDisk(bulkEvents);
    res.json({ events: bulkEvents });
    return;
  }
  if (!event || !event.id) {
    res.status(400).json({ error: "Valid event object with id is required" });
    return;
  }
  const existing = loadEventsFromDisk();
  const idx = existing.findIndex((e) => e.id === event.id);
  if (idx >= 0) {
    existing[idx] = event;
  } else {
    existing.unshift(event);
  }
  saveEventsToDisk(existing);
  res.json({ event, events: existing });
});
app.post("/api/events/reset-demo", (_req, res) => {
  const existing = loadEventsFromDisk();
  const userCreatedEvents = existing.filter((e) => !e.isDemo);
  const freshDemos = JSON.parse(JSON.stringify(INITIAL_DEMO_EVENTS));
  const combined = [...freshDemos, ...userCreatedEvents];
  saveEventsToDisk(combined);
  res.json({ events: combined });
});
app.get("/api/ai/status", (_req, res) => {
  const hasKey = Boolean(getConfiguredApiKey());
  res.json({
    configured: hasKey,
    provider: process.env.AI_PROVIDER || "gemini",
    model: getAiModelName(),
    mode: hasKey ? "live" : "preview_fallback"
  });
});
app.post("/api/ai/blueprint", async (req, res) => {
  const payload = req.body;
  const fallback = buildContextualBlueprintFallback(payload);
  const ai = createGenAiClient();
  if (!ai) {
    res.json({
      ...fallback,
      aiMode: "preview_fallback",
      notice: "Generated using GatherOS Contextual Planning Engine (Preview Mode)."
    });
    return;
  }
  try {
    const prompt = `Generate a comprehensive, culturally sensitive, and financially realistic Event Blueprint for this celebration:
Event Name: ${payload.name}
Category: ${payload.category}
Date: ${payload.date}
Location: ${payload.location}
Guest Count: ${payload.guestCount}
Total Target Budget: ${payload.currencySymbol}${payload.targetBudget} (${payload.currency})
Preferred Theme: ${payload.preferredTheme}
Cultural Preferences: ${payload.culturalPreferences}
Must-Have Experiences: ${payload.mustHaveExperiences}
Restrictions / Requirements: ${payload.restrictionsOrRequirements}
Priorities: ${(payload.planningPriorities || []).join(", ")}
Specific Details: ${JSON.stringify(
      payload.weddingSpecifics || payload.birthdaySpecifics || payload.communitySpecifics || {}
    )}

Explain WHY your recommendations match the user's event, budget, preferences, and constraints.`;
    const response = await withTimeout(
      ai.models.generateContent({
        model: getAiModelName(),
        contents: prompt,
        config: {
          systemInstruction: "You are GatherOS, an elite AI celebration architect and financial event operations strategist. Return structured JSON matching the schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              eventConcept: { type: Type.STRING },
              personalizedTheme: { type: Type.STRING },
              colorPalette: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    hex: { type: Type.STRING },
                    usage: { type: Type.STRING }
                  }
                }
              },
              decorationRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              venueConsiderations: { type: Type.ARRAY, items: { type: Type.STRING } },
              foodAndCateringRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              entertainmentSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              guestExperienceIdeas: { type: Type.ARRAY, items: { type: Type.STRING } },
              vendorCategoriesNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
              priorityChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
              riskAndContingency: { type: Type.ARRAY, items: { type: Type.STRING } },
              personalizedRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
              whyItMatches: { type: Type.STRING }
            }
          }
        }
      }),
      8e3
    );
    const parsedBlueprint = JSON.parse((response.text ?? "{}").trim());
    const mergedBlueprint = {
      ...fallback.blueprint,
      ...parsedBlueprint,
      colorPalette: parsedBlueprint.colorPalette && parsedBlueprint.colorPalette.length > 0 ? parsedBlueprint.colorPalette : fallback.blueprint.colorPalette
    };
    res.json({
      blueprint: mergedBlueprint,
      budgetItems: fallback.budgetItems,
      timelineTasks: fallback.timelineTasks,
      ideas: fallback.ideas,
      momentMap: fallback.momentMap,
      aiMode: "live"
    });
  } catch (err) {
    console.warn("Live Gemini blueprint call fell back to contextual engine:", err);
    res.json({
      ...fallback,
      aiMode: "preview_fallback",
      notice: "Generated using GatherOS Contextual Planning Engine."
    });
  }
});
app.post("/api/ai/copilot", async (req, res) => {
  const { event, userMessage } = req.body;
  if (!event || !userMessage) {
    res.status(400).json({ error: "event and userMessage are required" });
    return;
  }
  const summary = calculateBudgetSummary(event);
  const q = userMessage.toLowerCase();
  const buildContextualCopilotReply = () => {
    const sym = event.currencySymbol;
    const actions = [];
    let content = "";
    const reasoning = `Analyzed ${event.name} (${event.guestCount} guests in ${event.location}, target ${sym}${event.targetBudget.toLocaleString()}, allocated ${sym}${summary.totalAllocatedBudget.toLocaleString()}, actual ${sym}${summary.actualExpenses.toLocaleString()}).`;
    if (q.includes("reduce") || q.includes("save") || q.includes("exceed") || q.includes("budget") || q.includes("prioritize")) {
      const savings = Math.round(event.targetBudget * 0.08);
      content = `Based on **${event.name}** (${event.guestCount} guests in ${event.location}), your total allocated budget is **${sym}${summary.totalAllocatedBudget.toLocaleString()}** against a target of **${sym}${event.targetBudget.toLocaleString()}**, with **${sym}${summary.actualExpenses.toLocaleString()}** in actual recorded expenses (${summary.utilizationPercentage}% utilized).

Here are 3 concrete ways to recover **~${sym}${savings.toLocaleString()}** immediately without compromising hospitality:
1. **Multi-Function Decor Reuse:** Repurpose daytime floral structures into the evening reception by swapping marigold garlands for brass candle hurricanes (saves ~${sym}${Math.round(savings * 0.45).toLocaleString()}).
2. **Curated Signature Stations:** Focus Food & Catering on 3 high-impact regional live counters rather than an oversized buffet.
3. **Digital-First RSVP Suite:** Keep printed keepsake invitations strictly for elders and VIPs.`;
      actions.push({
        id: `act-${Date.now()}-1`,
        type: "add_task",
        label: "Add to Timeline: Audit Decor Reuse with Decorator",
        description: "Creates a High-Priority task to reuse floral frames across functions.",
        payload: {
          title: `Audit multi-function decor reuse to save ${sym}${Math.round(savings * 0.45).toLocaleString()}`,
          milestoneCategory: "Decoration planning",
          priority: "High"
        }
      });
      actions.push({
        id: `act-${Date.now()}-2`,
        type: "save_idea",
        label: "Save Idea: Brass Hurricane Candlelight Swap",
        description: "Saves this cost-saving lighting concept to your Ideas Studio.",
        payload: {
          title: "Multi-Function Brass Hurricane & Local Foliage Swap",
          category: "Decoration",
          description: `Repurpose structural arches from afternoon to evening using brass lanterns to save ${sym}${Math.round(savings * 0.45).toLocaleString()}.`,
          estimatedCost: Math.round(event.targetBudget * 0.03)
        }
      });
    } else if (q.includes("guest") || q.includes("increase")) {
      const extraGuests = Math.max(20, Math.round(event.guestCount * 0.2));
      const newTotalGuests = event.guestCount + extraGuests;
      const perGuestFood = Math.round(event.targetBudget * 0.32 / Math.max(1, event.guestCount));
      const extraCost = extraGuests * perGuestFood;
      content = `If your guest count for **${event.name}** increases from **${event.guestCount} to ${newTotalGuests} guests (+${extraGuests} guests)**:

- **Food & Catering Impact:** At your current ~${sym}${perGuestFood.toLocaleString()}/guest catering tier, expect an estimated **+${sym}${extraCost.toLocaleString()}** increase.
- **Seating & Centerpieces:** You will need **${Math.ceil(extraGuests / 8)} additional dining tables** and floral centerpieces.
- **Fixed Costs Unchanged:** Your Photography and Entertainment fees stay constant.

You can also model exact headcount numbers interactively in the **Smart Budget Planner \u2192 What-If Simulator**.`;
      actions.push({
        id: `act-${Date.now()}-3`,
        type: "add_budget",
        label: `Add to Budget: +${extraGuests} Guest Catering Buffer (${sym}${extraCost.toLocaleString()})`,
        description: "Adds an estimated catering buffer line item for additional guests.",
        payload: {
          category: "Food and catering",
          title: `Supplemental Catering Buffer (+${extraGuests} Guests Estimate)`,
          allocatedAmount: extraCost,
          plannedAmount: extraCost
        }
      });
    } else if (q.includes("menu") || q.includes("vegetarian") || q.includes("food")) {
      const menuBudget = Math.round(event.targetBudget * 0.04);
      content = `Here is a curated menu concept tailored for **${event.name}** (${event.guestCount} guests in ${event.location}, honoring *${event.restrictionsOrRequirements}*):

- **Welcome Refreshment:** Rosewater & saffron-cardamom thandai / botanical spritz served in terracotta kulhads or chilled coupe glasses.
- **Interactive Live Starters:** Crisp Palak Patta Chaat, Jodhpuri Mirchi Vada, and charred herb flatbreads.
- **Main Feast:** Heritage Dal Baati Churma / Saffron Cauliflower Steak, Paneer & Seasonal Vegetable Royal Thali, with a clearly separated **Strict Jain / Root-Free Counter**.
- **Late-Evening Finale:** Piping hot Jalebi-Rabri & Kesar Badam Milk under the stars.`;
      actions.push({
        id: `act-${Date.now()}-4`,
        type: "save_idea",
        label: "Save Idea: Artisanal Vegetarian & Jain Live Menu",
        description: "Saves this bespoke menu concept to your Personalized Ideas Studio.",
        payload: {
          title: "Artisanal Vegetarian & Dedicated Jain Live Feast",
          category: "Food",
          description: "Live Palak Patta Chaat, separated Jain counter, and late-night kulhad Kesar milk.",
          estimatedCost: menuBudget
        }
      });
      actions.push({
        id: `act-${Date.now()}-5`,
        type: "add_task",
        label: "Add to Timeline: Lock Vegetarian & Jain Tasting",
        description: "Adds a catering confirmation task to your Event Timeline.",
        payload: {
          title: "Confirm dedicated Jain & vegetarian live station layout with Caterer",
          milestoneCategory: "Catering finalization",
          priority: "High"
        }
      });
    } else if (q.includes("rain") || q.includes("weather") || q.includes("backup")) {
      const tentCost = Math.round(event.targetBudget * 0.05);
      content = `Here is a proactive **Weather & Outdoor Backup Plan** for **${event.name}** in ${event.location}:

1. **72-Hour Weather Lock:** Establish a T-72 hour decision checkpoint with your venue manager to deploy waterproof clear-span canopies or shift into the indoor hall.
2. **Arrival Comfort (Moment Map Stage 1):** Station 30 oversized umbrellas and warm spiced welcome drinks at the entrance gate.
3. **Acoustic & Power Protection:** Place all sound consoles and decorative brass uplights on elevated waterproof risers.`;
      actions.push({
        id: `act-${Date.now()}-6`,
        type: "add_task",
        label: "Add to Timeline: 72-Hour Weather Tenting Checkpoint",
        description: "Adds a High-Priority weather readiness milestone to your Timeline.",
        payload: {
          title: "Execute 72-hour weather forecast review & canopy standby check",
          milestoneCategory: "Final event-day preparation",
          priority: "High"
        }
      });
      actions.push({
        id: `act-${Date.now()}-7`,
        type: "add_budget",
        label: `Add to Budget: Weather Canopy Hold (${sym}${tentCost.toLocaleString()})`,
        description: "Allocates a weather protection line item in Emergency Reserve.",
        payload: {
          category: "Emergency reserve",
          title: "Weatherproof Canopy & Umbrella Valet Standby Estimate",
          allocatedAmount: tentCost,
          plannedAmount: tentCost
        }
      });
    } else {
      const pendingCount = event.timelineTasks.filter((t) => t.status !== "Completed").length;
      content = `For **${event.name}** (${event.guestCount} guests in ${event.location} on ${event.date}):

- **Financial Snapshot:** ${sym}${summary.actualExpenses.toLocaleString()} actual spend out of ${sym}${summary.totalAllocatedBudget.toLocaleString()} allocated (${sym}${summary.remainingBudget.toLocaleString()} remaining).
- **Timeline Priority:** You have **${pendingCount} active milestones** remaining. Focus this week on locking final catering headcounts, confirming vendor load-in windows, and walking through your 8-stage **Moment Map**.
- **Experience Enhancement:** Introduce a tactile welcome touchpoint (local craft artisan or handwritten place cards) so guests feel immersed from the first 5 minutes.`;
      actions.push({
        id: `act-${Date.now()}-8`,
        type: "add_task",
        label: "Add to Timeline: Complete Weekly Vendor Sync",
        description: "Adds a milestone task to verify vendor load-in and headcount.",
        payload: {
          title: `Sync with Venue & Caterer for ${event.guestCount}-guest layout in ${event.location}`,
          milestoneCategory: "Preparation milestone",
          priority: "High"
        }
      });
      actions.push({
        id: `act-${Date.now()}-9`,
        type: "save_idea",
        label: "Save Idea: Handwritten Welcome Place Cards",
        description: "Saves personalized guest place cards to your Ideas Studio.",
        payload: {
          title: "Calligraphed Guest Memory Place Cards",
          category: "Guest activities",
          description: "Personal 1-sentence note at every seat to spark immediate table conversation.",
          estimatedCost: Math.round(event.targetBudget * 0.01)
        }
      });
    }
    return { content, reasoning, actions };
  };
  const fallbackReply = buildContextualCopilotReply();
  const ai = createGenAiClient();
  if (!ai) {
    res.json({
      ...fallbackReply,
      aiMode: "preview_fallback"
    });
    return;
  }
  try {
    const recentConversation = (event.copilotHistory || []).slice(-6).map((message) => `${message.role === "user" ? "Organizer" : "Copilot"}: ${message.content}`).join("\n");
    const prompt = `Active Event Context:
- Name: ${event.name} (${event.category})
- Date & Location: ${event.date} in ${event.location}
- Guests: ${event.guestCount}
- Target Budget: ${event.currencySymbol}${event.targetBudget}
- Total Allocated Budget: ${event.currencySymbol}${summary.totalAllocatedBudget}
- Actual Expenses: ${event.currencySymbol}${summary.actualExpenses}
- Remaining Budget: ${event.currencySymbol}${summary.remainingBudget}
- Theme: ${event.preferredTheme}
- Cultural Preferences: ${event.culturalPreferences}
- Restrictions: ${event.restrictionsOrRequirements}
- Pending Tasks: ${event.timelineTasks.filter((t) => t.status !== "Completed").map((t) => `${t.title} (Due ${t.dueDate})`).join("; ")}
- Recent Conversation: ${recentConversation || "No earlier messages."}

User Question: "${userMessage}"

Answer the user's actual question directly. Use the recent conversation only when it helps. Give specific, practical advice grounded in the event details and exact figures above; do not force unrelated suggestions or invent facts. Mention assumptions when exact details are unavailable. Keep the answer warm and concise, and explain briefly why the advice fits this event.`;
    const response = await withTimeout(
      ai.models.generateContent({
        model: getAiModelName(),
        contents: prompt,
        config: {
          systemInstruction: "You are Gather AI Copilot, an intelligent, warm, and practical celebration strategist. Always reference the exact event name, budget figures, guest count, and cultural context. Return JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            }
          }
        }
      }),
      2e4
    );
    const parsed = JSON.parse((response.text ?? "{}").trim());
    res.json({
      content: parsed.content || fallbackReply.content,
      reasoning: parsed.reasoning || fallbackReply.reasoning,
      actions: fallbackReply.actions,
      aiMode: "live"
    });
  } catch (err) {
    console.warn("Copilot live call fell back to contextual engine:", err);
    res.json({
      ...fallbackReply,
      aiMode: "preview_fallback"
    });
  }
});
app.post("/api/ai/invite-draft", async (req, res) => {
  const { eventName, category, date, location, theme, culturalPreferences, groupName, tone } = req.body;
  const fallbackDraft = `Dear Friends & Family (${groupName || "Honored Guests"}),

With great joy, we invite you to celebrate **${eventName}** with us on **${date}** at **${location}**.

Inspired by *${theme}* and our cherished traditions (*${culturalPreferences}*), we have planned an evening of warm conversation, music, and shared celebration.

Kindly share your RSVP and any dietary preferences at your earliest convenience so we can prepare a wonderful welcome for you.

With love and anticipation,
The Hosts`;
  const ai = createGenAiClient();
  if (!ai) {
    res.json({ draft: fallbackDraft, aiMode: "preview_fallback" });
    return;
  }
  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: getAiModelName(),
        contents: `Draft a warm, ${tone || "elegant"} invitation message for "${eventName}" (${category}) taking place on ${date} in ${location}. Theme: ${theme}. Cultural context: ${culturalPreferences}. Guest group: ${groupName || "All Guests"}. Do not include any placeholder brackets that look broken; make it ready to copy and send.`
      }),
      8e3
    );
    res.json({
      draft: response.text || fallbackDraft,
      aiMode: "live"
    });
  } catch {
    res.json({ draft: fallbackDraft, aiMode: "preview_fallback" });
  }
});
async function startLocalServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GatherOS server listening on http://localhost:${PORT}`);
  });
}
if (!IS_VERCEL) {
  startLocalServer();
}
var server_default = app;
export {
  app,
  server_default as default
};
