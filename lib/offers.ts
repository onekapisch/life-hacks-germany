import type { Lang } from "./i18n";

export type OfferCategory =
  | "food"
  | "groceries"
  | "shopping"
  | "travel"
  | "family";

export type OfferStatus = "ongoing" | "limited";

interface OfferCopy {
  title: string;
  summary: string;
  benefit: string;
  eligibility: string;
  whyItMatters: string;
  watchouts: string[];
}

interface OfferDefinition {
  id: string;
  rank: number;
  brand: string;
  category: OfferCategory;
  status: OfferStatus;
  officialUrl: string;
  verifiedAt: string;
  copy: Record<Lang, OfferCopy>;
}

export interface Offer extends OfferCopy {
  id: string;
  rank: number;
  brand: string;
  category: OfferCategory;
  status: OfferStatus;
  officialUrl: string;
  verifiedAt: string;
}

const VERIFIED_AT = "2026-03-30T08:44:00+02:00";

const offerDefinitions: OfferDefinition[] = [
  {
    id: "lieferando-prime",
    rank: 1,
    brand: "Lieferando x Amazon Prime",
    category: "food",
    status: "ongoing",
    officialUrl: "https://www.amazon.de/prime/offer/lieferando/prime-deal",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Free delivery on many Lieferando orders with Amazon Prime",
        summary:
          "Prime members can unlock free delivery on eligible Lieferando restaurants with a EUR 15 minimum order.",
        benefit: "Waived delivery fee on participating restaurants.",
        eligibility:
          "Amazon Prime membership, linked account, participating restaurants, and minimum order rules apply.",
        whyItMatters:
          "Food delivery is a repeat expense in Germany, so this can save money without changing habits.",
        watchouts: [
          "Only participating restaurants are included.",
          "Service fees and menu markups can still apply.",
        ],
      },
      de: {
        title: "Kostenlose Lieferung bei vielen Lieferando-Bestellungen mit Amazon Prime",
        summary:
          "Prime-Mitglieder können bei teilnehmenden Lieferando-Restaurants die Liefergebühr sparen, meist ab EUR 15 Mindestbestellwert.",
        benefit: "Keine Liefergebühr bei teilnehmenden Restaurants.",
        eligibility:
          "Amazon Prime, verknüpftes Konto, teilnehmende Restaurants und Mindestbestellwert sind nötig.",
        whyItMatters:
          "Lieferando ist für viele Haushalte in Deutschland ein häufiger Ausgabenpunkt und damit ein echter Alltagshebel.",
        watchouts: [
          "Gilt nicht bei allen Restaurants.",
          "Servicegebühren und höhere Menüpreise können trotzdem anfallen.",
        ],
      },
    },
  },
  {
    id: "rewe-bonus",
    rank: 2,
    brand: "REWE Bonus",
    category: "groceries",
    status: "ongoing",
    officialUrl: "https://www.rewe.de/bonus/",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Stack weekly coupons and bonus boosters in the REWE app",
        summary:
          "REWE Bonus combines app coupons, category boosters, and regular grocery promos in one account.",
        benefit: "Coupon savings and bonus actions on everyday grocery spend.",
        eligibility: "REWE account and app participation.",
        whyItMatters:
          "REWE is a mainstream supermarket chain, so the savings can repeat weekly instead of once.",
        watchouts: [
          "The strongest value usually comes from activating offers before checkout.",
          "Some rewards are category-specific rather than storewide.",
        ],
      },
      de: {
        title: "Wöchentliche Coupons und Bonus-Booster in der REWE App stapeln",
        summary:
          "REWE Bonus kombiniert App-Coupons, Kategorie-Booster und reguläre Aktionsvorteile in einem Konto.",
        benefit: "Coupon-Ersparnisse und Bonusaktionen auf den alltäglichen Lebensmitteleinkauf.",
        eligibility: "REWE Konto und aktive Nutzung der App.",
        whyItMatters:
          "REWE ist für viele Menschen in Deutschland ein Stamm-Supermarkt, daher ist der Nutzen regelmäßig statt einmalig.",
        watchouts: [
          "Der beste Effekt kommt meist nur mit aktivierten Angeboten vor dem Einkauf.",
          "Viele Vorteile gelten nur für einzelne Kategorien.",
        ],
      },
    },
  },
  {
    id: "payback-main",
    rank: 3,
    brand: "PAYBACK",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.payback.de/",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Use one points app across major German chains",
        summary:
          "PAYBACK remains one of the most widely used loyalty systems in Germany for groceries, drugstores, fuel, and online shopping.",
        benefit: "Points plus app coupons across many partner brands.",
        eligibility: "PAYBACK account or app.",
        whyItMatters:
          "It works across multiple stores, so users can collect value without locking themselves into one chain.",
        watchouts: [
          "Base points are usually small unless you activate extra coupons.",
          "The best use case is consistent scanning across partner shops.",
        ],
      },
      de: {
        title: "Ein Punkte-System für viele große Ketten in Deutschland nutzen",
        summary:
          "PAYBACK bleibt eines der am weitesten verbreiteten Bonusprogramme in Deutschland für Supermarkt, Drogerie, Tanken und Online-Shopping.",
        benefit: "Punkte plus App-Coupons bei vielen Partnern.",
        eligibility: "PAYBACK Konto oder App.",
        whyItMatters:
          "Das Programm funktioniert über mehrere Marken hinweg und zwingt Nutzer nicht in nur eine Kette.",
        watchouts: [
          "Die Basispunkte allein sind oft klein, wenn keine Extra-Coupons aktiviert werden.",
          "Richtig stark wird es erst bei konsequenter Nutzung über mehrere Partner hinweg.",
        ],
      },
    },
  },
  {
    id: "dm-payback",
    rank: 4,
    brand: "dm + PAYBACK",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.dm.de/services/payback",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Collect PAYBACK at dm on frequent household purchases",
        summary:
          "dm lets shoppers combine everyday drugstore spending with PAYBACK points and app-driven savings.",
        benefit: "Points and coupon stacking on repeat essentials.",
        eligibility: "dm checkout with PAYBACK card or app barcode.",
        whyItMatters:
          "Drugstore runs are frequent in Germany, so small repeated gains compound faster than one-off coupons.",
        watchouts: [
          "Not every item is boosted at the same time.",
          "The best savings often come from combining dm promos with active PAYBACK coupons.",
        ],
      },
      de: {
        title: "PAYBACK bei dm auf häufige Haushaltskäufe mitnehmen",
        summary:
          "Bei dm lassen sich Alltagskäufe in der Drogerie mit PAYBACK Punkten und App-Vorteilen kombinieren.",
        benefit: "Punkte und Coupon-Stacking auf wiederkehrende Basics.",
        eligibility: "PAYBACK Karte oder App-Barcode an der dm Kasse.",
        whyItMatters:
          "Drogerie-Einkäufe kommen regelmäßig vor und bringen deshalb über die Zeit mehr als ein einmaliger Gutschein.",
        watchouts: [
          "Nicht alle Artikel sind gleichzeitig geboostert.",
          "Am meisten bringt die Kombination aus dm Aktionen und aktivierten PAYBACK Coupons.",
        ],
      },
    },
  },
  {
    id: "dm-glueckskind",
    rank: 12,
    brand: "dm Glueckskind",
    category: "family",
    status: "ongoing",
    officialUrl: "https://www.dm.de/glueckskind",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "dm Glueckskind adds targeted perks for pregnancy and young families",
        summary:
          "dm's family program is designed around pregnancy, babies, and early family shopping needs inside a chain many households already use.",
        benefit: "Family-focused coupons, samples, and targeted dm perks.",
        eligibility: "Relevant life stage plus dm program participation.",
        whyItMatters:
          "For young families, targeted baby and care offers can beat generic percentage coupons by a wide margin.",
        watchouts: [
          "The value depends on the household actually matching the target group.",
          "Program benefits can vary by stage and campaign.",
        ],
      },
      de: {
        title: "dm Glückskind bringt gezielte Vorteile für Schwangerschaft und junge Familien",
        summary:
          "Das Familienprogramm von dm richtet sich an Schwangerschaft, Babyzeit und frühe Familienphase in einer Kette, die viele Haushalte ohnehin nutzen.",
        benefit: "Familienbezogene Coupons, Proben und gezielte dm Vorteile.",
        eligibility: "Passende Lebensphase plus Teilnahme am dm Programm.",
        whyItMatters:
          "Gerade für junge Familien können gezielte Baby- und Pflegevorteile deutlich wertvoller sein als allgemeine Prozentaktionen.",
        watchouts: [
          "Sinnvoll ist das nur für passende Haushaltssituationen.",
          "Der Vorteilsmix kann sich je nach Phase und Kampagne ändern.",
        ],
      },
    },
  },
  {
    id: "lidl-plus",
    rank: 5,
    brand: "Lidl Plus",
    category: "groceries",
    status: "ongoing",
    officialUrl: "https://www.lidl.de/c/lidl-plus/s10007388",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Use Lidl Plus for weekly coupons and app-only grocery savings",
        summary:
          "Lidl Plus combines weekly coupons, partner perks, receipts, and rotating supermarket deals in one app.",
        benefit: "App coupons and limited weekly discounts at one of Germany's biggest discounters.",
        eligibility: "Lidl Plus app account.",
        whyItMatters:
          "This is one of the most practical recurring savings tools for price-sensitive grocery shopping in Germany.",
        watchouts: [
          "Many discounts only work after manual activation in the app.",
          "Some partner perks change without much notice.",
        ],
      },
      de: {
        title: "Lidl Plus für wöchentliche Coupons und App-Rabatte im Supermarkt nutzen",
        summary:
          "Lidl Plus bündelt wöchentliche Coupons, Partner-Vorteile, digitale Bons und wechselnde Marktaktionen in einer App.",
        benefit: "App-Coupons und zeitlich begrenzte Rabatte bei einem der größten Discounter Deutschlands.",
        eligibility: "Lidl Plus App-Konto.",
        whyItMatters:
          "Für preisbewusstes Einkaufen in Deutschland ist das einer der praktischsten wiederkehrenden Sparhebel.",
        watchouts: [
          "Viele Rabatte funktionieren nur nach manueller Aktivierung.",
          "Einige Partner-Vorteile können sich kurzfristig ändern.",
        ],
      },
    },
  },
  {
    id: "lidl-disney-plus",
    rank: 6,
    brand: "Lidl Plus x Disney+",
    category: "shopping",
    status: "limited",
    officialUrl: "https://www.lidl.de/c/lidl-plus/s10007388",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Get the current Lidl Plus Disney+ partner price while it is live",
        summary:
          "Lidl Plus currently highlights a Disney+ partner offer inside the benefits area, making it one of the more visible app perks.",
        benefit: "Discounted Disney+ access through the Lidl Plus partner offer.",
        eligibility: "Lidl Plus account and the current partner promotion.",
        whyItMatters:
          "This is a mainstream entertainment perk tied to a mass-market grocery app, so awareness is high and adoption is easy.",
        watchouts: [
          "This is a partner offer and can change or disappear.",
          "Check the exact plan conditions before activating.",
        ],
      },
      de: {
        title: "Den aktuellen Lidl Plus Disney+ Partnervorteil nutzen, solange er live ist",
        summary:
          "Lidl Plus hebt derzeit ein Disney+ Angebot im Vorteilebereich hervor und macht es damit zu einem der sichtbarsten App-Perks.",
        benefit: "Vergünstigter Disney+ Zugang über den Lidl Plus Partnervorteil.",
        eligibility: "Lidl Plus Konto und die aktuell laufende Partneraktion.",
        whyItMatters:
          "Der Vorteil verbindet einen Mainstream-Streamingdienst mit einer sehr verbreiteten Einkaufs-App und ist dadurch für viele sofort nutzbar.",
        watchouts: [
          "Als Partneraktion kann das Angebot angepasst oder beendet werden.",
          "Vor Aktivierung die genauen Tarifbedingungen prüfen.",
        ],
      },
    },
  },
  {
    id: "lidl-family-club",
    rank: 10,
    brand: "Lidl Family Club",
    category: "family",
    status: "ongoing",
    officialUrl: "https://www.lidl.de/c/lidl-plus/s10007388",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Family households can activate Lidl's Family Club perks",
        summary:
          "Lidl Plus currently promotes a Family Club area with additional family-oriented offers and advantages.",
        benefit: "Extra family-targeted app deals inside the Lidl ecosystem.",
        eligibility: "Lidl Plus and the Family Club participation flow.",
        whyItMatters:
          "For households with children, family-specific grocery and baby offers can beat generic coupons.",
        watchouts: [
          "This only makes sense for relevant household types.",
          "Offer depth can vary over time.",
        ],
      },
      de: {
        title: "Familien können die Lidl Family Club Vorteile aktivieren",
        summary:
          "Lidl Plus bewirbt derzeit einen Family Club Bereich mit zusätzlichen familienbezogenen Angeboten und Vorteilen.",
        benefit: "Zusatzvorteile für Familien innerhalb des Lidl Ökosystems.",
        eligibility: "Lidl Plus und die Teilnahme am Family Club.",
        whyItMatters:
          "Für Haushalte mit Kindern können familienbezogene Einkaufsangebote deutlich mehr bringen als allgemeine Coupons.",
        watchouts: [
          "Relevant ist das nur für passende Haushaltssituationen.",
          "Die Tiefe der Vorteile kann sich im Zeitverlauf ändern.",
        ],
      },
    },
  },
  {
    id: "kaufland-xtra",
    rank: 7,
    brand: "Kaufland Card XTRA",
    category: "groceries",
    status: "ongoing",
    officialUrl: "https://filiale.kaufland.de/kaufland-xtra.html",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Use Kaufland Card XTRA for coupons, points, and supermarket promos",
        summary:
          "Kaufland's program combines personalized savings, points, and campaign-based rewards for one of Germany's largest grocery formats.",
        benefit: "Coupons, points, and periodic bonus actions.",
        eligibility: "Kaufland Card registration.",
        whyItMatters:
          "Kaufland baskets are often large, so even small percentage gains can scale quickly.",
        watchouts: [
          "Many benefits are personalized, so two users may not see the same offers.",
          "Promotional mechanics can change by campaign.",
        ],
      },
      de: {
        title: "Kaufland Card XTRA für Coupons, Punkte und Marktaktionen nutzen",
        summary:
          "Das Kaufland Programm verbindet personalisierte Rabatte, Punkte und Aktionsvorteile für eines der größten Einkaufsformate in Deutschland.",
        benefit: "Coupons, Punkte und regelmäßige Bonusaktionen.",
        eligibility: "Registrierte Kaufland Card.",
        whyItMatters:
          "Bei großen Einkaufskörben können schon kleine Prozentvorteile schnell relevant werden.",
        watchouts: [
          "Viele Vorteile sind personalisiert und daher nicht für alle gleich.",
          "Aktionsmechaniken können je nach Kampagne wechseln.",
        ],
      },
    },
  },
  {
    id: "rossmann-app",
    rank: 8,
    brand: "ROSSMANN App",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.rossmann.de/de/service-und-hilfe/rossmann-app",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Check the ROSSMANN app before every drugstore run",
        summary:
          "ROSSMANN's app remains one of the most common places to find rotating percentage coupons and product deals in Germany.",
        benefit: "Recurring app coupons and in-store savings.",
        eligibility: "ROSSMANN app usage.",
        whyItMatters:
          "This is one of the most mainstream savings habits for household, baby, and personal care shopping.",
        watchouts: [
          "Coupon sets rotate frequently and exclusions apply.",
          "The percentage coupon is not always universal.",
        ],
      },
      de: {
        title: "Vor jedem Drogerie-Einkauf die ROSSMANN App prüfen",
        summary:
          "Die ROSSMANN App bleibt eine der häufigsten Quellen für rotierende Prozent-Coupons und Produktangebote in Deutschland.",
        benefit: "Wiederkehrende App-Coupons und Marktvorteile.",
        eligibility: "Nutzung der ROSSMANN App.",
        whyItMatters:
          "Gerade für Haushalt, Baby und Pflege ist das eine der verbreitetsten Spargewohnheiten im Alltag.",
        watchouts: [
          "Coupon-Sets wechseln häufig und es gelten Ausschlüsse.",
          "Der Prozent-Coupon ist nicht immer universell einsetzbar.",
        ],
      },
    },
  },
  {
    id: "deutschlandcard",
    rank: 9,
    brand: "DeutschlandCard",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.deutschlandcard.de/",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Use DeutschlandCard across Netto, Esso, and partner shopping",
        summary:
          "DeutschlandCard remains a large-scale German loyalty network with app coupons, points, and partner shopping rewards.",
        benefit: "Points and offers across multiple partner brands.",
        eligibility: "DeutschlandCard account or app.",
        whyItMatters:
          "It gives users a second mainstream loyalty route beyond PAYBACK, especially for Netto and Esso shoppers.",
        watchouts: [
          "Value depends on partner mix and coupon activation.",
          "Points programs work best when used consistently.",
        ],
      },
      de: {
        title: "DeutschlandCard bei Netto, Esso und Partnern einsetzen",
        summary:
          "Die DeutschlandCard bleibt ein großes deutsches Bonusnetzwerk mit App-Coupons, Punkten und Partner-Vorteilen.",
        benefit: "Punkte und Angebote über mehrere Partnermarken hinweg.",
        eligibility: "DeutschlandCard Konto oder App.",
        whyItMatters:
          "Sie ist neben PAYBACK die wichtigste Alternative, vor allem für Netto und Esso Nutzer.",
        watchouts: [
          "Der Nutzen hängt stark vom Partner-Mix und aktivierten Coupons ab.",
          "Punkteprogramme lohnen sich vor allem bei konsequenter Nutzung.",
        ],
      },
    },
  },
  {
    id: "rossmann-babywelt",
    rank: 13,
    brand: "ROSSMANN babywelt",
    category: "family",
    status: "ongoing",
    officialUrl: "https://www.rossmann.de/de/baby-kind/babywelt",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "ROSSMANN babywelt is still one of the best-known family perk programs",
        summary:
          "ROSSMANN babywelt focuses on pregnancy and family needs with targeted vouchers and member-style benefits.",
        benefit: "Pregnancy and baby-focused vouchers in a mainstream drugstore ecosystem.",
        eligibility: "ROSSMANN babywelt participation.",
        whyItMatters:
          "Families often use both dm and ROSSMANN, so comparing both programs can materially reduce repeat care spending.",
        watchouts: [
          "This only matters for the relevant household type.",
          "Voucher depth changes by stage and campaign timing.",
        ],
      },
      de: {
        title: "ROSSMANN babywelt bleibt eines der bekanntesten Familienprogramme",
        summary:
          "ROSSMANN babywelt richtet sich an Schwangerschaft und Familienalltag mit gezielten Gutscheinen und Vorteilen.",
        benefit: "Gutscheine und Familienvorteile in einer sehr verbreiteten Drogerie-Kette.",
        eligibility: "Teilnahme an ROSSMANN babywelt.",
        whyItMatters:
          "Viele Familien nutzen sowohl dm als auch ROSSMANN, daher lohnt sich der Vergleich beider Programme direkt.",
        watchouts: [
          "Relevant ist das nur für passende Haushaltssituationen.",
          "Die Gutschein-Tiefe ändert sich je nach Phase und Kampagne.",
        ],
      },
    },
  },
  {
    id: "ikea-family-rewards",
    rank: 14,
    brand: "IKEA Family Rewards",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.ikea.com/de/de/ikea-family/benefits/rewards/",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "IKEA Family Rewards adds a second savings layer beyond member prices",
        summary:
          "IKEA now highlights reward-based benefits alongside the broader IKEA Family program, which makes the offer stack more tangible.",
        benefit: "Reward-based vouchers and perks on top of core IKEA Family access.",
        eligibility: "IKEA Family participation and the reward mechanics listed by IKEA.",
        whyItMatters:
          "For move-ins and home setup phases, combining member prices with rewards can create outsized savings compared with smaller weekly coupons.",
        watchouts: [
          "This matters most for users already spending meaningfully at IKEA.",
          "Reward conditions can change, so check the current thresholds.",
        ],
      },
      de: {
        title: "IKEA Family Rewards legt eine zweite Sparschicht über die normalen Mitgliederpreise",
        summary:
          "IKEA hebt inzwischen Reward-Vorteile neben dem allgemeinen IKEA Family Programm hervor und macht das Sparmodell greifbarer.",
        benefit: "Reward-basierte Gutscheine und Zusatzvorteile oberhalb der normalen IKEA Family Nutzung.",
        eligibility: "IKEA Family Teilnahme und die jeweils geltenden Reward-Regeln.",
        whyItMatters:
          "Gerade bei Umzug oder Haushaltsaufbau kann die Kombination aus Mitgliederpreisen und Rewards deutlich stärker sein als kleine Wochen-Coupons.",
        watchouts: [
          "Wirklich relevant wird das nur bei spürbaren IKEA Ausgaben.",
          "Die Reward-Bedingungen sollten vor der Nutzung aktuell geprüft werden.",
        ],
      },
    },
  },
  {
    id: "ikea-family",
    rank: 11,
    brand: "IKEA Family",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.ikea.com/de/de/ikea-family/",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "IKEA Family is still one of Germany's easiest membership perks",
        summary:
          "IKEA Family gives member pricing and store perks through a free, widely recognised retail program.",
        benefit: "Member prices and additional in-store advantages.",
        eligibility: "Free IKEA Family membership.",
        whyItMatters:
          "Furniture, storage, and household setup costs can spike after moving, so IKEA perks are unusually useful in Germany.",
        watchouts: [
          "The value depends on actually shopping at IKEA.",
          "Benefits can vary between online and in-store use.",
        ],
      },
      de: {
        title: "IKEA Family bleibt einer der einfachsten Mitglieder-Vorteile in Deutschland",
        summary:
          "IKEA Family bietet Mitgliederpreise und Shop-Vorteile über ein kostenloses, sehr bekanntes Retail-Programm.",
        benefit: "Mitgliederpreise und zusätzliche Store-Vorteile.",
        eligibility: "Kostenlose IKEA Family Mitgliedschaft.",
        whyItMatters:
          "Gerade nach Umzug oder beim Haushaltsaufbau können IKEA Vorteile in Deutschland überdurchschnittlich nützlich sein.",
        watchouts: [
          "Der Nutzen hängt davon ab, ob du wirklich bei IKEA einkaufst.",
          "Vorteile können online und im Markt unterschiedlich ausfallen.",
        ],
      },
    },
  },
  {
    id: "mymediamarkt",
    rank: 15,
    brand: "myMediaMarkt",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.mediamarkt.de/de/legal/teilnahmebedingungen-my-mediamarkt/teilnahmebedingungen-my-mediamarkt",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "myMediaMarkt adds member prices and tech-shopping coupons",
        summary:
          "MediaMarkt's membership layer focuses on promotional prices, coupons, and purchase-related account perks.",
        benefit: "Member deals and coupon-style savings on electronics shopping.",
        eligibility: "myMediaMarkt registration.",
        whyItMatters:
          "Electronics purchases are often large-ticket, so occasional member pricing can save more than grocery coupons.",
        watchouts: [
          "This matters most when you already plan to buy tech.",
          "Promos can be short-lived around campaign windows.",
        ],
      },
      de: {
        title: "myMediaMarkt bringt Mitgliederpreise und Technik-Coupons",
        summary:
          "Die MediaMarkt Mitgliedschaft setzt auf Aktionspreise, Coupons und accountbezogene Vorteile rund um Technik-Einkäufe.",
        benefit: "Mitgliederdeals und couponartige Ersparnisse bei Elektronik-Käufen.",
        eligibility: "myMediaMarkt Registrierung.",
        whyItMatters:
          "Elektronik ist oft ein großer Einzelposten, daher können Mitgliederpreise hier mehr bringen als viele kleine Supermarkt-Coupons.",
        watchouts: [
          "Relevant ist das vor allem, wenn ohnehin Technik-Käufe geplant sind.",
          "Viele Aktionen laufen nur in kurzen Kampagnenfenstern.",
        ],
      },
    },
  },
  {
    id: "hm-member",
    rank: 16,
    brand: "H&M Member",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www2.hm.com/de_de/member.html",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "H&M Member still offers member prices, points, and regular app promos",
        summary:
          "H&M's membership program combines points, member pricing, and fashion offers inside a mainstream retail brand.",
        benefit: "Member prices, points, and campaign-based clothing deals.",
        eligibility: "H&M Member account.",
        whyItMatters:
          "For basic clothing and seasonal shopping, H&M remains one of the most visible retail programs in Germany.",
        watchouts: [
          "Fashion discounts can drive impulse buying if you were not planning a purchase.",
          "The real value depends on member-price availability for relevant items.",
        ],
      },
      de: {
        title: "H&M Member bietet weiter Mitgliederpreise, Punkte und regelmäßige App-Aktionen",
        summary:
          "Das H&M Programm kombiniert Punkte, Mitgliederpreise und Fashion-Angebote innerhalb einer sehr sichtbaren Retail-Marke.",
        benefit: "Mitgliederpreise, Punkte und kampagnenbasierte Rabatte für Kleidung.",
        eligibility: "H&M Member Konto.",
        whyItMatters:
          "Für Basic-Kleidung und saisonale Einkäufe bleibt H&M eines der bekanntesten Programme in Deutschland.",
        watchouts: [
          "Mode-Rabatte verleiten leicht zu Impulskäufen.",
          "Der echte Nutzen hängt davon ab, ob relevante Artikel gerade als Member-Preis laufen.",
        ],
      },
    },
  },
  {
    id: "mymcdonalds",
    rank: 17,
    brand: "MyMcDonald's",
    category: "food",
    status: "ongoing",
    officialUrl: "https://www.mcdonalds.com/de/de-de/app.html",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Use the McDonald's app for rotating coupons and rewards",
        summary:
          "The MyMcDonald's app continues to be one of Germany's most widely recognised fast-food savings channels.",
        benefit: "App coupons and reward points in a mainstream food app.",
        eligibility: "McDonald's app account.",
        whyItMatters:
          "For users who already buy fast food, app pricing is usually better than ordering without the app.",
        watchouts: [
          "Coupon quality changes frequently.",
          "It only saves money if it replaces, rather than creates, a purchase.",
        ],
      },
      de: {
        title: "Die McDonald's App für rotierende Coupons und Rewards nutzen",
        summary:
          "Die MyMcDonald's App bleibt einer der bekanntesten Sparkanäle für Fast Food in Deutschland.",
        benefit: "App-Coupons und Reward-Punkte in einer Mainstream-Food-App.",
        eligibility: "McDonald's App-Konto.",
        whyItMatters:
          "Wer dort ohnehin kauft, bekommt über die App meist bessere Preise als ohne App-Bestellung.",
        watchouts: [
          "Die Coupon-Qualität wechselt häufig.",
          "Sparen funktioniert nur, wenn der Kauf ohnehin geplant war.",
        ],
      },
    },
  },
  {
    id: "too-good-to-go",
    rank: 18,
    brand: "Too Good To Go",
    category: "food",
    status: "ongoing",
    officialUrl: "https://www.toogoodtogo.com/de/how-does-the-app-work",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Too Good To Go is still one of the most practical food-saving apps",
        summary:
          "The app helps users pick up unsold food from nearby bakeries, supermarkets, and restaurants at reduced prices.",
        benefit: "Discounted surprise bags from local food businesses.",
        eligibility: "Too Good To Go app and local participating stores.",
        whyItMatters:
          "It combines savings with convenience and works in many German cities, especially for bakery and grocery pickups.",
        watchouts: [
          "Availability is highly location- and time-dependent.",
          "You do not choose the exact items in advance.",
        ],
      },
      de: {
        title: "Too Good To Go bleibt eine der praktischsten Apps zum Sparen bei Essen",
        summary:
          "Die App hilft dabei, übrig gebliebenes Essen von Bäckereien, Supermärkten und Restaurants in der Nähe günstiger abzuholen.",
        benefit: "Vergünstigte Überraschungstüten lokaler Food-Anbieter.",
        eligibility: "Too Good To Go App und teilnehmende Läden in der Umgebung.",
        whyItMatters:
          "Die App verbindet Ersparnis und Alltagstauglichkeit und funktioniert in vielen deutschen Städten, besonders bei Bäckern und Supermärkten.",
        watchouts: [
          "Verfügbarkeit hängt stark von Ort und Uhrzeit ab.",
          "Der genaue Inhalt ist vorher nicht frei wählbar.",
        ],
      },
    },
  },
  {
    id: "bahncard-25",
    rank: 19,
    brand: "BahnCard 25",
    category: "travel",
    status: "ongoing",
    officialUrl: "https://www.bahn.de/angebot/bahncard/bahncard25",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "BahnCard 25 remains the easiest recurring rail discount to understand",
        summary:
          "Deutsche Bahn's BahnCard 25 offers a straightforward fare reduction for many train journeys.",
        benefit: "25% discount on many Deutsche Bahn fares.",
        eligibility: "Paid BahnCard 25 membership.",
        whyItMatters:
          "For anyone taking medium or long-distance trains more than occasionally, this can pay back quickly.",
        watchouts: [
          "It is only worth it when your annual train spending is high enough.",
          "Check renewal terms before purchase.",
        ],
      },
      de: {
        title: "Die BahnCard 25 bleibt der einfachste wiederkehrende Bahn-Rabatt",
        summary:
          "Die BahnCard 25 der Deutschen Bahn bietet eine leicht verständliche Preisreduktion für viele Zugfahrten.",
        benefit: "25 Prozent Rabatt auf viele Deutsche-Bahn-Tarife.",
        eligibility: "Kostenpflichtige BahnCard 25.",
        whyItMatters:
          "Wer mehr als nur selten Fernverkehr fährt, holt die Kosten oft schnell wieder rein.",
        watchouts: [
          "Sie lohnt sich nur bei ausreichend hohem Bahn-Umsatz im Jahr.",
          "Vor dem Kauf die Verlängerungsbedingungen prüfen.",
        ],
      },
    },
  },
  {
    id: "thalia-kultclub",
    rank: 20,
    brand: "Thalia KultClub",
    category: "shopping",
    status: "ongoing",
    officialUrl: "https://www.thalia.de/vorteile/club/club-aktion",
    verifiedAt: VERIFIED_AT,
    copy: {
      en: {
        title: "Thalia KultClub adds shipping and coupon value for regular readers",
        summary:
          "Thalia's loyalty program bundles member actions such as coupons, partner perks, and shipping-related advantages.",
        benefit: "Member coupons and convenience perks for books and gifts.",
        eligibility: "Thalia KultClub membership.",
        whyItMatters:
          "Books, school supplies, and gifts are common recurring purchases, so regular Thalia customers can extract steady value.",
        watchouts: [
          "This matters most for users who already buy from Thalia.",
          "Fixed-price book rules in Germany limit discount depth on many titles.",
        ],
      },
      de: {
        title: "Thalia KultClub bringt Versand- und Coupon-Vorteile für regelmäßige Leser",
        summary:
          "Das Thalia Programm bündelt Aktionen wie Coupons, Partner-Vorteile und praktische Versandvorteile.",
        benefit: "Mitglieder-Coupons und Komfortvorteile für Bücher und Geschenke.",
        eligibility: "Thalia KultClub Mitgliedschaft.",
        whyItMatters:
          "Bücher, Schulbedarf und Geschenke sind wiederkehrende Ausgaben, daher kann das für regelmäßige Thalia Kunden sinnvoll sein.",
        watchouts: [
          "Relevant ist das vor allem für Menschen, die ohnehin bei Thalia kaufen.",
          "Die Buchpreisbindung in Deutschland begrenzt bei vielen Titeln die Rabatt-Tiefe.",
        ],
      },
    },
  },
];

export function getAllOffers(lang: Lang): Offer[] {
  return offerDefinitions
    .map((offer) => ({
      id: offer.id,
      rank: offer.rank,
      brand: offer.brand,
      category: offer.category,
      status: offer.status,
      officialUrl: offer.officialUrl,
      verifiedAt: offer.verifiedAt,
      ...offer.copy[lang],
    }))
    .sort((a, b) => a.rank - b.rank);
}

export function getFeaturedOffers(lang: Lang, count = 3): Offer[] {
  return getAllOffers(lang).slice(0, count);
}

export function getLatestOfferVerificationDate(): string {
  return offerDefinitions
    .map((offer) => offer.verifiedAt)
    .sort((a, b) => Date.parse(b) - Date.parse(a))[0];
}

export function formatOfferVerification(value: string, lang: Lang): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "de-DE", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}
