export interface StitchingLookbookSlide {
  id: string;
  name: string;
  subtitle: string;
  tag: string;
  description: string;
  image: string;
  specs: string[];
}

export interface ServiceCustomInfoField {
  key: string;
  label: string;
  placeholder: string;
  type?: 'text' | 'date' | 'select';
  options?: string[];
}

export interface ServiceMeasurementField {
  key: string;
  label: string;
  placeholder: string;
  hint: string;
}

export interface StitchingServiceConfig {
  slug: string;
  name: string;
  shortName: string;
  titleLine1: string;
  titleLine2: string;
  shortTag: string;
  turnaround: string;
  description: string;
  image: string;
  highlights: string[];
  popularStyles: string[];
  lookbookSlides: StitchingLookbookSlide[];
  step1Label: string;
  step1Options: string[];
  step2Label: string;
  step2Options: string[];
  step3Label: string;
  step3Options: string[];
  step4SectionTitle: string;
  step4ChoiceLabel: string;
  step4Choices: string[];
  customInfoFields: ServiceCustomInfoField[];
  step5Label: string;
  addons: string[];
  measurementTitle: string;
  measurementSubtitle: string;
  measurementFields: ServiceMeasurementField[];
}

export const STITCHING_SERVICES_CONFIG: StitchingServiceConfig[] = [
  // =====================================================================
  // 1. SAREE BLOUSE STITCHING
  // =====================================================================
  {
    slug: 'saree-blouse-stitching',
    name: 'Saree Blouse Stitching',
    shortName: 'Saree Blouses',
    titleLine1: 'SAREE BLOUSE',
    titleLine2: 'STITCHING ATELIER',
    shortTag: 'PERFECT FIT & PURE COTTON LINING',
    turnaround: '2–4 Business Days',
    description:
      'Precision-cut saree blouses crafted with pre-washed 100% pure mulmul cotton lining, sculpted princess or katori darts, contrast saree-border piping, and handmade silk dori tassels.',
    image: '/images/nalmara/hd/cat_blouses_hd.jpg',
    highlights: ['Pre-Washed Mulmul Lining', 'Princess & Katori Cut', 'Contrast Border Piping'],
    popularStyles: ['Princess Cut', 'Boat Neck', 'Deep U with Dori', 'Pot Neck', 'Katori Cut'],
    lookbookSlides: [
      {
        id: 'sb-1',
        name: 'Princess-Cut Silk Saree Blouse',
        subtitle: 'Sculpted Contour • Zero Shoulder Drop',
        tag: 'SIGNATURE FIT',
        description:
          'Tailored with contoured princess seams and pre-shrunk pure cotton lining so the shoulders never slip even with deep back necklines.',
        image: '/images/nalmara/hd/cat_blouses_hd.jpg',
        specs: ['Princess Seam Contour', 'Pure Cotton Lining', 'Anti-Slip Shoulder Cut'],
      },
      {
        id: 'sb-2',
        name: 'Deep Pot-Neck Dori Tassel Blouse',
        subtitle: 'Classic South Indian Back Architecture',
        tag: 'FESTIVE FAVORITE',
        description:
          'Traditional paan / pot-neck back finished with contrast gold tissue piping and handcrafted silk thread latkan hangings.',
        image: '/images/nalmara/hd/stitching_blouse_hd.jpg',
        specs: ['Pot-Neck Cutout', 'Custom Silk Latkans', 'Concealed Seam Piping'],
      },
      {
        id: 'sb-3',
        name: 'Boat-Neck Elbow Border Blouse',
        subtitle: 'Regal Kanchipuram Zari Border Placement',
        tag: 'HERITAGE STYLE',
        description:
          'Elegant wide boat neckline paired with 11-inch elbow sleeves showcasing your saree’s original zari border with crisp mitred corners.',
        image: '/images/nalmara/hd/prod_kanchipuram_saree_hd.jpg',
        specs: ['11" Elbow Sleeve', 'Original Zari Border Fit', 'Keyhole Back Option'],
      },
      {
        id: 'sb-4',
        name: 'Traditional 4-Dart & Katori Blouse',
        subtitle: 'Everyday Comfort • Breathable Finish',
        tag: 'DAILY & OFFICE WEAR',
        description:
          'Classic 4-dart and single/double katori cut blouses engineered for all-day breathability with 1.5-inch extra interior margin seams.',
        image: '/images/nalmara/hd/cat_sarees_hd.jpg',
        specs: ['4-Dart / Katori Shaping', '1.5" Extra Seam Margin', 'Front or Back Hook'],
      },
    ],
    step1Label: '1. Select Blouse Cut & Silhouette',
    step1Options: [
      'Princess Cut (Contoured Fit)',
      'Traditional 4-Dart South Indian Cut',
      'Single / Double Katori Cut',
      'Sabyasachi Deep V-Plunge Cut',
      'High-Collar / Regal Neck Cut',
      'Peplum Waist Saree Blouse',
    ],
    step2Label: '2. Select Front & Back Neck Pattern',
    step2Options: [
      'Deep U Back with Dori Tassel',
      'Bridal Pot Neck (Paan / Drop Back)',
      'Boat Neck with Back Keyhole',
      'Sweetheart Front + Deep Round Back',
      'Square Classic Traditional Neck',
      'Collar Front + Teardrop Cutout Back',
    ],
    step3Label: '3. Select Sleeve Length & Style',
    step3Options: [
      'Elbow Sleeve (10–11") with Zari Border',
      'Classic Short Sleeve (5–6")',
      'Traditional Pattu Puff Sleeve',
      '3/4th Royal Sleeve (14–15")',
      'Cap / Megam Short Sleeve',
      'Sleeveless with Piped Armhole',
    ],
    step4SectionTitle: '4. Saree Blouse Closure & Fabric Specifications',
    step4ChoiceLabel: 'Hook / Zip Opening Preference',
    step4Choices: [
      'Front Hook & Eye Opening',
      'Back Hook & Eye Opening',
      'Concealed Side Zip + Back Hook',
    ],
    customInfoFields: [
      {
        key: 'sareeFabricType',
        label: 'Your Saree / Blouse Fabric Type',
        placeholder: 'Select fabric type',
        type: 'select',
        options: [
          'Kanchipuram Pure Pattu / Silk',
          'Soft Silk / Mysore Silk',
          'Cotton / Chettinad / Linen',
          'Organza / Tissue / Tussar',
          'Georgette / Chiffon / Crepe',
        ],
      },
      {
        key: 'pipingColor',
        label: 'Contrast Piping & Tassel Shade',
        placeholder: 'e.g. Rani Pink & Antique Gold Zari',
        type: 'text',
      },
      {
        key: 'liningPreference',
        label: 'Inner Lining Preference',
        placeholder: 'Select lining',
        type: 'select',
        options: [
          'Pre-Washed 100% Pure Mulmul Cotton',
          'Heavy Poplin Cotton Lining',
          'Satin + Cotton Double Lining (For Organza)',
        ],
      },
    ],
    step5Label: '5. Saree Blouse Finishing & Add-ons',
    addons: [
      'Soft Imported Padded Cups',
      'Contrast Gold Zari / Silk Thread Piping',
      'Handcrafted Silk Latkan Back Tassels',
      'Saree Pico & Cotton Falls Finishing',
      '1.5-Inch Extra Interior Alteration Margin',
    ],
    measurementTitle: '6. Saree Blouse Measurements (Inches)',
    measurementSubtitle:
      'Enter measurements from a well-fitting sample blouse or body measurements in inches.',
    measurementFields: [
      { key: 'upperChest', label: 'Upper Chest (in)', placeholder: 'e.g. 34', hint: 'Above bust line' },
      { key: 'fullBust', label: 'Full Bust Round (in)', placeholder: 'e.g. 36', hint: 'Fullest part of bust' },
      { key: 'waistRound', label: 'Blouse Waist / Underbust (in)', placeholder: 'e.g. 30', hint: 'Bottom hem of blouse' },
      { key: 'shoulder', label: 'Shoulder Width (in)', placeholder: 'e.g. 14.5', hint: 'Bone to bone across back' },
      { key: 'blouseLength', label: 'Blouse Full Length (in)', placeholder: 'e.g. 14.5', hint: 'Shoulder to bottom hem' },
      { key: 'sleeveLength', label: 'Sleeve Length (in)', placeholder: 'e.g. 10.5', hint: 'Shoulder to sleeve end' },
      { key: 'sleeveRound', label: 'Sleeve Loose / Mori (in)', placeholder: 'e.g. 11.5', hint: 'Circumference at sleeve hem' },
      { key: 'armhole', label: 'Armhole Round (in)', placeholder: 'e.g. 16', hint: 'Around shoulder joint' },
      { key: 'frontNeckDepth', label: 'Front Neck Depth (in)', placeholder: 'e.g. 7.0', hint: 'Shoulder to front dip' },
      { key: 'backNeckDepth', label: 'Back Neck Depth (in)', placeholder: 'e.g. 9.5', hint: 'Shoulder to back dip' },
    ],
  },

  // =====================================================================
  // 2. BRIDAL & DESIGNER BLOUSES
  // =====================================================================
  {
    slug: 'bridal-designer-blouses',
    name: 'Bridal & Designer Blouses',
    shortName: 'Bridal Blouses',
    titleLine1: 'BRIDAL & DESIGNER',
    titleLine2: 'AARI WORK BLOUSES',
    shortTag: 'HANDCRAFTED ZARDOZI, KUNDAN & AARI',
    turnaround: '4–7 Business Days',
    description:
      'Heirloom Muhurtham and Reception bridal blouses hand-embroidered on wooden khatla frames with antique zardozi bullion, temple cutwork, kundan stones, and custom couple-name latkans.',
    image: '/images/nalmara/hd/stitching_blouse_hd.jpg',
    highlights: ['Hand Aari & Zardozi', 'Temple Cutwork Back', 'Custom Couple Latkans'],
    popularStyles: ['Muhurtham Heavy Aari', 'Temple Cutwork', 'Jhumka Sleeve', 'Scallop Back'],
    lookbookSlides: [
      {
        id: 'bb-1',
        name: 'Muhurtham Heavy Zardozi & Aari Blouse',
        subtitle: 'Full Elbow Jaal • Antique Gold Bullion',
        tag: 'MUHURTHAM COUTURE',
        description:
          'Hand-embroidered over 40+ hours with antique gold zari, French knots, and ruby-emerald kundan stones matched to your Kanchipuram bridal silk.',
        image: '/images/nalmara/hd/stitching_blouse_hd.jpg',
        specs: ['40+ Hrs Hand Aari', 'Kundan & Zardozi Bullion', 'Bridal Padded Fit'],
      },
      {
        id: 'bb-2',
        name: 'Temple Cutwork & Lakshmi Motif Back',
        subtitle: 'Scalloped Arch Cutout • Pearl Edging',
        tag: 'TEMPLE HERITAGE',
        description:
          'Intricate South Indian temple gopuram cutwork along the back neckline with hanging pearl droplets and antique coin embellishments.',
        image: '/images/nalmara/hd/cat_blouses_hd.jpg',
        specs: ['Laser-Clean Cutwork', 'Pearl Droplet Edging', 'Temple Coin Motifs'],
      },
      {
        id: 'bb-3',
        name: '3D Peacock & Hanging Jhumka Sleeve',
        subtitle: 'Silk Thread Embossing • Beaded Tassels',
        tag: 'DESIGNER SIGNATURE',
        description:
          'Raised 3D padded peacock and lotus motifs on the sleeves finished with swaying gold-bead jhumka hangings at the elbow hem.',
        image: '/images/nalmara/hd/prod_designer_saree_hd.jpg',
        specs: ['3D Embossed Motifs', 'Hanging Sleeve Jhumkas', 'Custom Saree Color Match'],
      },
      {
        id: 'bb-4',
        name: 'Reception Cutdana, Mirror & Net Blouse',
        subtitle: 'Swarovski Crystals • Sheer Illusion Neck',
        tag: 'RECEPTION GLAMOUR',
        description:
          'Contemporary metallic cutdana, sequence, and real mirror embroidery on raw silk or imported bridal net for cocktail and reception nights.',
        image: '/images/nalmara/hd/prod_kanchipuram_saree_hd.jpg',
        specs: ['Cutdana & Real Mirror', 'Illusion Net Back', 'Double Contoured Cups'],
      },
    ],
    step1Label: '1. Select Bridal Embroidery Density & Craft',
    step1Options: [
      'Grand Muhurtham Full Sleeve + Heavy Back Aari',
      'Temple Gopuram Cutwork & Kundan Stone Work',
      '3D Embossed Peacock & Lotus Silk Thread Work',
      'Checked (Kattam) Zardozi & Pearl Jaal Work',
      'Reception Cutdana, Sequin & Mirror Work',
      'Minimal Scallop Border & Butti Highlight Work',
    ],
    step2Label: '2. Select Bridal Back Neck Architecture',
    step2Options: [
      'Scalloped Temple Arch Cutwork Back',
      'Deep Pot Neck with Hanging Bridal Jhumka Dori',
      'Sheer Illusion Net Back with Central Motif',
      'Doli / Raja-Rani Bridal Storyboard Back',
      'Royal Sweetheart Back with Pearl Droplet Fringe',
      'High Regal Neck with Teardrop Keyhole Cutout',
    ],
    step3Label: '3. Select Bridal Sleeve Design',
    step3Options: [
      'Elbow Sleeve (11") with Hanging Bead Jhumkas',
      'Heavy Zardozi Kattam (Checked) Full Elbow Sleeve',
      'Cutwork Scallop Border Elbow Sleeve',
      'Vanki (Armlet) Motif Bridal Silk Sleeve',
      'Traditional Bridal Pattu Puff Sleeve with Work',
      'Full-Length Bridal Choli Sleeve',
    ],
    step4SectionTitle: '4. Wedding Event & Saree Zari Matching Details',
    step4ChoiceLabel: 'Primary Zari & Stone Tone on Your Saree',
    step4Choices: [
      'Antique 24K Gold Zari & Ruby/Green Kundan',
      'Bright Yellow Gold Zari & Pearl Work',
      'Copper / Rose-Gold Zari & Kemp Stones',
      'Silver / Platinum Cutdana & Crystal Work',
    ],
    customInfoFields: [
      {
        key: 'weddingDate',
        label: 'Wedding / Muhurtham Date',
        placeholder: 'Select wedding date',
        type: 'date',
      },
      {
        key: 'sareeColorCombo',
        label: 'Bridal Saree Body & Border Color',
        placeholder: 'e.g. Korvai Maroon Body with Mustard Gold Border',
        type: 'text',
      },
      {
        key: 'customLatkanText',
        label: 'Bride & Groom Initials / Name for Latkans',
        placeholder: 'e.g. A ❤ S (or Leave Blank for Motif Latkan)',
        type: 'text',
      },
    ],
    step5Label: '5. Bridal Couture Add-ons & Finishing',
    addons: [
      'Double Contoured Bridal Padded Cups',
      'Personalized Couple Name / Doli Latkan Hangings',
      'Matching Aari Embroidered Hip Belt (Oddiyanam)',
      'Bridal Saree Kuchu (Silk Thread Tassel Knotting)',
      'Pre-Pleating & Box-Folding of Bridal Saree',
    ],
    measurementTitle: '6. Bridal Blouse Measurements (Inches)',
    measurementSubtitle:
      'Bridal blouses include trial-ready interior margins and custom dart contouring.',
    measurementFields: [
      { key: 'upperChest', label: 'Upper Chest (in)', placeholder: 'e.g. 34', hint: 'Above bust line' },
      { key: 'fullBust', label: 'Full Bust Round (in)', placeholder: 'e.g. 36', hint: 'Fullest bust measurement' },
      { key: 'apexLength', label: 'Shoulder to Apex Point (in)', placeholder: 'e.g. 9.5', hint: 'For bridal cup placement' },
      { key: 'waistRound', label: 'Blouse Waist Round (in)', placeholder: 'e.g. 29', hint: 'Snug lower band fit' },
      { key: 'shoulder', label: 'Shoulder Width (in)', placeholder: 'e.g. 14.5', hint: 'Back shoulder bone to bone' },
      { key: 'blouseLength', label: 'Blouse Full Length (in)', placeholder: 'e.g. 15', hint: 'Shoulder to hem' },
      { key: 'sleeveLength', label: 'Elbow Sleeve Length (in)', placeholder: 'e.g. 11', hint: 'Shoulder to above elbow' },
      { key: 'sleeveRound', label: 'Elbow Circumference (in)', placeholder: 'e.g. 11', hint: 'Around sleeve end' },
      { key: 'armhole', label: 'Armhole Round (in)', placeholder: 'e.g. 16', hint: 'Around arm joint' },
      { key: 'backNeckDepth', label: 'Front / Back Neck Depth (in)', placeholder: 'e.g. 7.5 / 10', hint: 'Front & back dip' },
    ],
  },

  // =====================================================================
  // 3. GIRLS' FROCKS & GOWNS
  // =====================================================================
  {
    slug: 'girls-frocks-gowns',
    name: "Girls' Frocks & Gowns",
    shortName: "Girls' Frocks",
    titleLine1: "GIRLS' FROCKS",
    titleLine2: '& PARTY GOWNS',
    shortTag: 'SKIN-SAFE MULMUL LINING • KIDS COUTURE',
    turnaround: '3–5 Business Days',
    description:
      'Dreamy birthday ball gowns, organza ruffle frocks, and festive silk party dresses tailored with feather-soft 100% mulmul cotton inner lining and concealed zero-scratch seams.',
    image: '/images/nalmara/hd/prod_kids_frock_hd.jpg',
    highlights: ['Zero-Itch Mulmul Lining', 'Soft Detachable Cancan', '2" Growth Seam Margin'],
    popularStyles: ['Flared Ball Gown', 'Butterfly Ruffle Frock', 'Pattu Silk Frock', 'Mom & Me Gown'],
    lookbookSlides: [
      {
        id: 'gf-1',
        name: 'Flared Organza Birthday Ball Gown',
        subtitle: 'Multi-Layer Soft Tulle • Detachable Satin Bow',
        tag: '1ST BIRTHDAY SPECIAL',
        description:
          'Cloud-like tiers of imported organza and soft tulle over double-layered breathable mulmul cotton so your little princess stays happy all day.',
        image: '/images/nalmara/hd/prod_kids_frock_hd.jpg',
        specs: ['Zero-Scratch Hidden Seams', 'Detachable Back Bow', 'Matching Hair Tiara'],
      },
      {
        id: 'gf-2',
        name: 'Traditional Pattu Silk Box-Pleat Frock',
        subtitle: 'Kanchipuram Zari Yoke • Puff Sleeves',
        tag: 'FESTIVE HERITAGE',
        description:
          'Crafted from pure silk or heirloom sarees with hand-embroidered beadwork on the yoke and deep box pleats for a regal festive look.',
        image: '/images/nalmara/hd/cat_kidswear_hd.jpg',
        specs: ['Pure Silk & Zari Border', '2" Grow-With-Child Margin', 'Soft Cotton Inner'],
      },
      {
        id: 'gf-3',
        name: 'Butterfly Ruffle & Peplum Party Dress',
        subtitle: 'Angel Flutter Sleeves • Twirl Skirt',
        tag: 'PARTY COUTURE',
        description:
          'Playful butterfly ruffle shoulders with hand-stitched 3D floral appliqués and a lightweight twirl-friendly circle skirt.',
        image: '/images/nalmara/hd/prod_kids_frock_hd.jpg',
        specs: ['3D Floral Appliqués', 'Lightweight Twirl Flare', 'Concealed Back Zip'],
      },
      {
        id: 'gf-4',
        name: 'Mom & Daughter Twining Silk Gown',
        subtitle: 'Coordinated Couture • Custom Embroidery',
        tag: 'MOM & ME EDITION',
        description:
          'Custom-designed matching gowns for mother and daughter with coordinated necklines, handwork yokes, and flared silhouettes.',
        image: '/images/nalmara/hd/cat_lehengas_hd.jpg',
        specs: ['Coordinated Mom & Kid Set', 'Custom Color Dyeing', 'Bespoke Fit'],
      },
    ],
    step1Label: "1. Select Frock / Gown Silhouette",
    step1Options: [
      'Princess Flared Ball Gown (Floor Length)',
      'Traditional Pattu Silk Box-Pleat Frock',
      'Butterfly Tiered Organza / Ruffle Frock',
      'High-Low Trail Birthday Party Gown',
      'A-Line Hand-Embroidered Yoke Knee Frock',
      'Convertible Pre-Stitched Kids Saree Gown',
    ],
    step2Label: '2. Select Neckline & Yoke Pattern',
    step2Options: [
      'Round Neck with Hand Pearl & Floral Yoke',
      'Boat Neck with Oversized Back Satin Bow',
      'Peter Pan Collar with Smocked / Pleated Chest',
      'Square Yoke with Shoulder Flutter Frills',
      'Sweetheart Illusion Net Yoke',
      'Asymmetric One-Shoulder Flower Appliqué',
    ],
    step3Label: '3. Select Kids Sleeve Style',
    step3Options: [
      'Butterfly / Angel Flutter Sleeves',
      'Traditional Pattu Puff Sleeves',
      'Sheer Organza Balloon Cuff Sleeves',
      'Sleeveless with Shoulder Ribbon Bows',
      'Ruffle Cap Sleeves',
      '3/4th Bell Party Sleeves',
    ],
    step4SectionTitle: "4. Child's Age Group, Cancan & Occasion Details",
    step4ChoiceLabel: 'Cancan & Flare Volume Preference',
    step4Choices: [
      'Soft Detachable Cancan with Cotton Cover (Recommended)',
      'Full Fluffy Princess Ball-Gown Cancan',
      'No Cancan (Soft Flowing Cotton & Silk Lining Only)',
    ],
    customInfoFields: [
      {
        key: 'childAgeGroup',
        label: "Child's Age Group",
        placeholder: 'Select age group',
        type: 'select',
        options: [
          'Infant (6 – 24 Months)',
          'Toddler (2 – 4 Years)',
          'Kids (5 – 8 Years)',
          'Pre-Teen (9 – 12 Years)',
          'Teen (13 – 16 Years)',
        ],
      },
      {
        key: 'occasionTheme',
        label: 'Occasion & Preferred Color Theme',
        placeholder: 'e.g. 1st Birthday — Pastel Lilac & Gold',
        type: 'text',
      },
      {
        key: 'fabricSource',
        label: 'Fabric Arrangement',
        placeholder: 'Select fabric arrangement',
        type: 'select',
        options: [
          'Provide My Own Saree / Fabric for Stitching',
          'Nalmara to Source Organza / Silk / Tulle Fabric',
          'Upcycle Mother’s Silk Saree into Kids Gown',
        ],
      },
    ],
    step5Label: '5. Kids Comfort & Accessory Add-ons',
    addons: [
      'Double-Layer 100% Mulmul Cotton Lining (Zero Skin Irritation)',
      'Oversized Detachable Back Satin Bow',
      '2-Inch Extra Growth Margin Inside Side & Shoulder Seams',
      'Matching Handcrafted Hairband / Bow Clip',
      'Mom & Daughter Twining Outfit Consultation',
    ],
    measurementTitle: "6. Girls' Frock & Gown Measurements (Inches)",
    measurementSubtitle:
      'Measure loosely over a thin cotton dress; we automatically add comfort ease for kids.',
    measurementFields: [
      { key: 'childAge', label: "Child's Exact Age", placeholder: 'e.g. 3 Yrs', hint: 'Age in months or years' },
      { key: 'chestRound', label: 'Chest Round (in)', placeholder: 'e.g. 22', hint: 'Around fullest chest part' },
      { key: 'waistRound', label: 'Waist Round (in)', placeholder: 'e.g. 21', hint: 'Around natural waist' },
      { key: 'shoulder', label: 'Shoulder Width (in)', placeholder: 'e.g. 9.5', hint: 'Shoulder bone to bone' },
      { key: 'yokeLength', label: 'Yoke Length (Shoulder–Waist) (in)', placeholder: 'e.g. 9', hint: 'Top bodice height' },
      { key: 'frockLength', label: 'Full Frock / Gown Length (in)', placeholder: 'e.g. 28', hint: 'Shoulder to knee or floor' },
      { key: 'sleeveLength', label: 'Sleeve Length (in)', placeholder: 'e.g. 4.5', hint: 'Shoulder to sleeve hem' },
      { key: 'armhole', label: 'Armhole / Sleeve Loose (in)', placeholder: 'e.g. 10', hint: 'Comfortable arm opening' },
    ],
  },

  // =====================================================================
  // 4. PAVADAI SATTAI & PATTU PAVADAI
  // =====================================================================
  {
    slug: 'pavadai-sattai-pattu-pavadai',
    name: 'Pavadai Sattai & Pattu Pavadai',
    shortName: 'Pavadai Sattai',
    titleLine1: 'PAVADAI SATTAI &',
    titleLine2: 'PATTU PAVADAI',
    shortTag: 'TRADITIONAL TAMIL HERITAGE • GROW-WITH-CHILD FIT',
    turnaround: '3–5 Business Days',
    description:
      'Authentic South Indian Pattu Pavadai Sattai tailored with traditional box pleats, adjustable cotton body-tap (chest vest), grow-with-child height tucks, and Aari embroidered yokes.',
    image: '/images/nalmara/hd/cat_kidswear_hd.jpg',
    highlights: ['Adjustable Body-Tap Vest', '2.5" Height Growth Tuck', 'Aari & Coin Work Yoke'],
    popularStyles: ['Box-Pleat Pattu Pavadai', 'Aari Work Sattai', 'Attached Koti Style', 'Infant Silk Set'],
    lookbookSlides: [
      {
        id: 'pp-1',
        name: 'Traditional Kanchipuram Pattu Pavadai Sattai',
        subtitle: 'Attached Cotton Body-Tap • Wide Zari Border',
        tag: 'AUTHENTIC HERITAGE',
        description:
          'Classic box-pleated silk pavadai attached to a soft cotton inner body-tap with adjustable shoulder buttons so the skirt never slips down.',
        image: '/images/nalmara/hd/cat_kidswear_hd.jpg',
        specs: ['Adjustable Shoulder Buttons', '2.5" Height Growth Tuck', 'Pure Cotton Body-Tap'],
      },
      {
        id: 'pp-2',
        name: 'Hand Aari Kasu & Mango Yoke Sattai',
        subtitle: 'Antique Coin Work • Puff Pattu Sleeves',
        tag: 'MUHURTHAM & EAR PIERCING',
        description:
          'Festive sattai blouse embellished with hand Aari mango motifs, Lakshmi kasu coins, and pleated hip frills for ear-piercing and wedding ceremonies.',
        image: '/images/nalmara/hd/prod_kids_frock_hd.jpg',
        specs: ['Hand Aari Kasu Work', 'Pleated Waist Frill', 'Pattu Puff Sleeves'],
      },
      {
        id: 'pp-3',
        name: 'Attached Koti Jacket & Peplum Pavadai',
        subtitle: 'Contrast Brocade Jacket • Tassel Dori',
        tag: 'DESIGNER TRADITIONAL',
        description:
          'Layered koti waistcoat or peplum-cut sattai paired with a full-flare silk pavadai and handcrafted silk thread waist tassels.',
        image: '/images/nalmara/hd/cat_sarees_hd.jpg',
        specs: ['Attached Brocade Koti', 'Waist Latkan Tassels', 'Mulmul Inner Lining'],
      },
      {
        id: 'pp-4',
        name: 'Heirloom Saree to Pattu Pavadai Conversion',
        subtitle: 'Preserve Family Tradition • Dual Zari Borders',
        tag: 'SAREE CONVERSION',
        description:
          'Transform a cherished Kanchipuram pattu saree into a matching Pavadai Sattai set utilizing the pallu for the sattai and zari borders for the skirt.',
        image: '/images/nalmara/hd/prod_kanchipuram_saree_hd.jpg',
        specs: ['Pallu-to-Sattai Cut', 'Double Zari Border Skirt', 'Zero Fabric Waste'],
      },
    ],
    step1Label: '1. Select Sattai (Top) Traditional Style',
    step1Options: [
      'Classic Hip-Length Sattai with Pleated Waist Frill',
      'Hand Aari Mango / Kasu Embroidered Yoke Sattai',
      'Attached Contrast Koti (Waistcoat Jacket) Sattai',
      'Peplum Umbrella-Flare Pattu Sattai',
      'Angrakha Side-Tie Traditional Sattai',
      'Infant Back-Knot Soft Cotton-Lined Sattai',
    ],
    step2Label: '2. Select Pavadai (Skirt) Pleat & Waist Construction',
    step2Options: [
      'Box-Pleated Pavadai with Attached Cotton Body-Tap (Chest Vest)',
      'Knife-Pleated Pavadai with Elastic + Drawstring Waist',
      'Umbrella Full-Flare Pavadai with Zari Border',
      'Double-Tiered Border Pattu Pavadai',
    ],
    step3Label: '3. Select Sattai Neck & Sleeve Detailing',
    step3Options: [
      'Traditional Pattu Puff Sleeve with Zari Border',
      'Short Sleeve with Hanging Gold Bead / Coin Edging',
      'Elbow Sleeve with Aari Motif Highlight',
      'Pot Neck Back with Silk Thread Tassel Dori',
      'Sleeveless Infant Comfort Neckline',
    ],
    step4SectionTitle: '4. Pattu Fabric & Grow-With-Child Specifications',
    step4ChoiceLabel: 'Inner Body-Tap (Cotton Vest) & Waist Preference',
    step4Choices: [
      'Attached Cotton Body-Tap with 2-Level Growth Buttons (Best for 0–9 Yrs)',
      'Separate Skirt with Half-Elastic + Drawstring Waist (Best for 8–15 Yrs)',
      'Both Body-Tap Loops + Drawstring Waistband',
    ],
    customInfoFields: [
      {
        key: 'childAgeCeremony',
        label: "Child's Age & Ceremony / Festival",
        placeholder: 'e.g. 4 Years — Ear Piercing / Pongal / Wedding',
        type: 'text',
      },
      {
        key: 'fabricSource',
        label: 'Pattu Material Source',
        placeholder: 'Select material source',
        type: 'select',
        options: [
          'Stitched from My Own Pattu Pavadai Material',
          'Convert Mother’s / Grandmother’s Silk Saree into Pavadai',
          'Source Pure / Art Pattu Material from Nalmara',
        ],
      },
      {
        key: 'colorContrast',
        label: 'Sattai & Pavadai Contrast Color Note',
        placeholder: 'e.g. Peacock Blue Sattai + Magenta Pink Pavadai',
        type: 'text',
      },
    ],
    step5Label: '5. Traditional Pavadai Sattai Add-ons',
    addons: [
      '2.5-Inch Hidden Height Tuck & Side Growth Margin',
      'Pure Mulmul Cotton Lining for Both Sattai & Pavadai',
      'Hand Aari Kasu (Coin) & Beadwork on Neckline',
      'Matching Pattu Potli Bag & Silk Scrunchie Set',
      'Matching Brother’s Pattu Shirt / Veshti Stitching',
    ],
    measurementTitle: '6. Pavadai Sattai Measurements (Inches)',
    measurementSubtitle:
      'Include full shoulder-to-floor length if opting for the attached cotton body-tap.',
    measurementFields: [
      { key: 'childAge', label: "Child's Age (Years)", placeholder: 'e.g. 4 Yrs', hint: 'For proportion grading' },
      { key: 'chestRound', label: 'Chest Round (in)', placeholder: 'e.g. 23', hint: 'Around chest' },
      { key: 'waistRound', label: 'Waist Round (in)', placeholder: 'e.g. 22', hint: 'Where skirt sits' },
      { key: 'shoulder', label: 'Shoulder Width (in)', placeholder: 'e.g. 10', hint: 'Bone to bone' },
      { key: 'sattaiLength', label: 'Sattai (Top) Length (in)', placeholder: 'e.g. 13.5', hint: 'Shoulder to below hip' },
      { key: 'pavadaiLength', label: 'Pavadai Skirt Length (in)', placeholder: 'e.g. 22', hint: 'Waist to ankle/floor' },
      { key: 'bodyTapFullLength', label: 'Shoulder to Floor Length (in)', placeholder: 'e.g. 32', hint: 'For attached body-tap vest' },
      { key: 'sleeveLength', label: 'Puff Sleeve Length & Round (in)', placeholder: 'e.g. 5 / 8.5', hint: 'Length & arm loose' },
    ],
  },

  // =====================================================================
  // 5. LEHENGA CHOLI & HALF SAREE
  // =====================================================================
  {
    slug: 'lehenga-choli-half-saree',
    name: 'Lehenga Choli & Half Saree',
    shortName: 'Lehenga & Half Saree',
    titleLine1: 'LEHENGA CHOLI &',
    titleLine2: 'HALF SAREE STITCHING',
    shortTag: 'KALIDAR FLARE • PATTU LANGA DHAVANI',
    turnaround: '4–6 Business Days',
    description:
      'Custom-flared 16-to-24 kali bridal lehengas and traditional South Indian Pattu Langa Dhavani (Half Saree) sets with structured waistbands, built-in cancan, and pre-pleated dupatta draping.',
    image: '/images/nalmara/hd/cat_lehengas_hd.jpg',
    highlights: ['16/24-Kali & Box Pleats', 'Structured Cancan Skirt', 'Pre-Pleated Dhavani Option'],
    popularStyles: ['Pattu Half Saree', '16-Kali Bridal Lehenga', 'Saree-to-Lehenga', 'Peplum Choli Set'],
    lookbookSlides: [
      {
        id: 'lh-1',
        name: '16-Kali Bridal & Festive Lehenga Choli',
        subtitle: 'Full Circle Ghera • Canvas & Cancan Hem',
        tag: 'BRIDAL & SANGEET',
        description:
          'Precision-panelled 16 or 24 kali lehenga skirt with structured buckram waistband, concealed zip, heavy latkans, and layered cancan.',
        image: '/images/nalmara/hd/cat_lehengas_hd.jpg',
        specs: ['16 / 24 Kali Flare', 'Built-In Layered Cancan', 'Embroidered Waist Belt'],
      },
      {
        id: 'lh-2',
        name: 'South Indian Pattu Langa Voni / Dhavani',
        subtitle: 'Deep Box Pleats • Pre-Pleated Half Saree',
        tag: 'HALF SAREE CEREMONY',
        description:
          'Authentic Kanchipuram Pattu Langa tailored with deep traditional pleats, a sculpted zari-border blouse, and ready-to-pin dhavani pleats.',
        image: '/images/nalmara/hd/prod_designer_saree_hd.jpg',
        specs: ['Traditional Pattu Langa', 'Ready-to-Wear Dhavani', 'Matching Hip Kamarbandh'],
      },
      {
        id: 'lh-3',
        name: 'Silk Saree to Designer Lehenga Conversion',
        subtitle: 'Pallu Choli • Zari Border Kali Skirt',
        tag: 'HEIRLOOM UPCYCLE',
        description:
          'Turn any silk or designer saree into a showstopping lehenga set using the rich pallu for the choli and seamless border placement along the skirt hem.',
        image: '/images/nalmara/hd/prod_kanchipuram_saree_hd.jpg',
        specs: ['Saree-to-Lehenga Craft', 'Continuous Zari Hem', 'Cotton & Satin Lining'],
      },
      {
        id: 'lh-4',
        name: 'Indo-Western Peplum & Cape Lehenga Set',
        subtitle: 'Corset / Peplum Choli • Attached Cape Drape',
        tag: 'RECEPTION & COCKTAIL',
        description:
          'Modern flared peplum top or corset choli paired with an umbrella-cut lehenga and pre-attached shoulder cape dupatta.',
        image: '/images/nalmara/hd/cat_blouses_hd.jpg',
        specs: ['Peplum / Corset Choli', 'Pre-Draped Cape Dupatta', 'Side Pocket in Lehenga'],
      },
    ],
    step1Label: '1. Select Ensemble Type & Skirt Construction',
    step1Options: [
      'Traditional South Indian Half Saree (Pattu Langa + Blouse + Dhavani)',
      '16-Kali / 24-Kali Flared Bridal Lehenga Choli',
      'Box-Pleated Silk Lehenga with Wide Zari Border',
      'Umbrella Full-Circle Ghera Lehenga Set',
      'Convert Silk Saree into Designer Lehenga & Choli',
      'Indo-Western Peplum / Long Jacket Lehenga',
    ],
    step2Label: '2. Select Choli (Blouse) Design',
    step2Options: [
      'Princess-Cut Padded Choli with Deep Back Dori',
      'Heavy Aari & Zardozi Embroidered Bridal Choli',
      'Sabyasachi Plunge V-Neck Designer Choli',
      'Waist-Length Peplum Flare Choli',
      'Boat Neck with Elbow Zari Border Sleeves',
      'Sweetheart Corset-Style Fitted Choli',
    ],
    step3Label: '3. Select Dhavani / Dupatta Styling',
    step3Options: [
      'Pre-Pleated & Stitched Ready-to-Wear Dhavani (1-Minute Drape)',
      'Classic Free-Flowing Dhavani with Zari Tassels',
      'Scallop Cutwork & Pearl Edged Net Dupatta',
      '4-Side Border Dupatta with Heavy Corner Latkans',
      'Attached Shoulder Cape Style Dupatta',
    ],
    step4SectionTitle: '4. Cancan Stiffening, Heel Height & Material Info',
    step4ChoiceLabel: 'Skirt Cancan & Hem Stiffening Preference',
    step4Choices: [
      'Heavy Bridal Cancan + Canvas Patta Hem (Maximum Royal Flare)',
      'Medium Single-Layer Festive Cancan (Balanced Twirl & Comfort)',
      'Soft Cotton Lining Only — No Cancan (Traditional Pattu Langa Feel)',
    ],
    customInfoFields: [
      {
        key: 'materialType',
        label: 'Your Outfit Material Type',
        placeholder: 'Select material type',
        type: 'select',
        options: [
          'Unstitched Half Saree (Langa + Blouse + Dhavani)',
          'Semi-Stitched Bridal / Party Lehenga Set',
          'Full Silk Saree to Convert into Lehenga',
          'Running Brocade / Raw Silk / Organza Fabric',
        ],
      },
      {
        key: 'heelHeight',
        label: 'Footwear / Heel Height You Will Wear',
        placeholder: 'e.g. 2.5 Inches Heels / Flat Sandals',
        type: 'text',
      },
      {
        key: 'eventOccasion',
        label: 'Event / Function & Target Date',
        placeholder: 'e.g. Half-Saree Ceremony / Sangeet on 24th Nov',
        type: 'text',
      },
    ],
    step5Label: '5. Lehenga & Half Saree Couture Add-ons',
    addons: [
      'Bespoke Heavy Beaded Waist Latkans (Skirt Hangings)',
      'Matching Embroidered Fabric Waist Belt (Kamarbandh)',
      'Concealed Side Pocket Inside Lehenga Skirt',
      'Pre-Pleated & Hook-Ready Dhavani Draping Service',
      'Soft Padded Cups + Side Zip in Choli',
    ],
    measurementTitle: '6. Lehenga Choli & Half Saree Measurements (Inches)',
    measurementSubtitle:
      'Measure lehenga length wearing the exact heel height you plan to wear for the event.',
    measurementFields: [
      { key: 'fullBust', label: 'Choli Full Bust (in)', placeholder: 'e.g. 36', hint: 'Fullest bust round' },
      { key: 'choliWaist', label: 'Choli Underbust / Waist (in)', placeholder: 'e.g. 30', hint: 'Bottom band of blouse' },
      { key: 'choliLength', label: 'Choli (Blouse) Length (in)', placeholder: 'e.g. 14.5', hint: 'Shoulder to blouse hem' },
      { key: 'shoulderSleeve', label: 'Shoulder & Sleeve Length (in)', placeholder: 'e.g. 14.5 / 11', hint: 'Shoulder / Sleeve len' },
      { key: 'lehengaWaist', label: 'Lehenga Tie-Waist Round (in)', placeholder: 'e.g. 31', hint: 'Where skirt waistband sits' },
      { key: 'hipRound', label: 'Hip Round (Widest Part) (in)', placeholder: 'e.g. 39', hint: 'For smooth hip fall' },
      { key: 'lehengaLength', label: 'Lehenga Skirt Length (with Heels) (in)', placeholder: 'e.g. 41', hint: 'Waist to floor with heels' },
      { key: 'dupattaDrape', label: 'Dhavani / Dupatta Length (m)', placeholder: 'e.g. 2.5m', hint: 'Standard or custom drape' },
    ],
  },

  // =====================================================================
  // 6. KURTI & SALWAR STITCHING
  // =====================================================================
  {
    slug: 'kurti-salwar-stitching',
    name: 'Kurti & Salwar Stitching',
    shortName: 'Kurti & Salwar',
    titleLine1: 'KURTI & SALWAR',
    titleLine2: 'CUSTOM STITCHING',
    shortTag: 'ANARKALI, STRAIGHT SUITS & PALAZZO SETS',
    turnaround: '2–4 Business Days',
    description:
      'Tailor-made straight-cut silk suits, floor-length kalidar Anarkalis, cigarette pants, palazzos, and Patiala salwars crafted with pre-shrunk cotton lining and utility side pockets.',
    image: '/images/nalmara/hd/cat_kurti_sets_hd.jpg',
    highlights: ['Anarkali & Straight Cut', 'Cigarette Pant & Palazzo', 'Deep Mobile Pockets'],
    popularStyles: ['Straight Suit + Pant', 'Floor-Length Anarkali', 'A-Line Silk Kurti', 'Patiala Salwar Set'],
    lookbookSlides: [
      {
        id: 'ks-1',
        name: 'Festive Silk Straight Kurta & Cigarette Pants',
        subtitle: 'Potli Button Placket • Tailored Ankle Pants',
        tag: 'BESTSELLER SUIT FIT',
        description:
          'Crisp straight-cut silk or chanderi kurta finished with handmade fabric potli buttons, side-slit piping, and ankle-grazer cigarette pants.',
        image: '/images/nalmara/hd/cat_kurti_sets_hd.jpg',
        specs: ['Potli Button Placket', 'Right-Side Smartphone Pocket', 'Half-Elastic Comfort Belt'],
      },
      {
        id: 'ks-2',
        name: 'Floor-Length Kalidar Anarkali Suit',
        subtitle: '16-Panelled Flare • Zari Border Hem',
        tag: 'FESTIVE & PARTY WEAR',
        description:
          'Regal panelled Anarkali gown suit sculpted through the bodice and flaring gracefully to the floor with churidar or palazzo bottoms.',
        image: '/images/nalmara/hd/prod_salwar_suit_hd.jpg',
        specs: ['16-Kali Bodice-to-Floor Flare', 'Pure Mulmul Lining', 'Concealed Side Zip'],
      },
      {
        id: 'ks-3',
        name: 'Everyday Cotton & Office Wear Kurti Set',
        subtitle: 'Mandarin Collar • Breathable Zero-Shrink Fit',
        tag: 'OFFICE & DAILY ELEGANCE',
        description:
          'Pre-washed mulmul and south cotton kurtis with smart collar or boat necklines, reinforced side slits, and comfortable straight pants.',
        image: '/images/nalmara/hd/prod_printed_kurti_hd.jpg',
        specs: ['Pre-Shrunk Finish', 'Reinforced Side Slits', 'All-Day Breathable Cut'],
      },
      {
        id: 'ks-4',
        name: 'Angrakha & Punjabi Patiala Salwar Suit',
        subtitle: 'Heavy Pleated Salwar • Lace & Organza Trim',
        tag: 'TRADITIONAL SALWAR',
        description:
          'Authentic pleated Patiala or Afghani salwar paired with a short kurta or cross-wrap Angrakha top with tassel ties and organza sleeve cuffs.',
        image: '/images/nalmara/hd/cat_kurti_sets_hd.jpg',
        specs: ['Full-Pleat Patiala / Afghani', 'Organza Cutwork Cuffs', 'Dupatta Lace Edging'],
      },
    ],
    step1Label: '1. Select Kurti / Top Silhouette',
    step1Options: [
      'Straight-Cut Side-Slit Kurta',
      'Floor-Length Kalidar Anarkali Suit',
      'A-Line Princess-Cut Flared Kurti',
      'Angrakha Wrap-Neck Designer Kurta',
      'Pakistani Loose-Fit Lace Insert Suit',
      'Short Kurti / Peplum Top',
    ],
    step2Label: '2. Select Bottom / Salwar Style',
    step2Options: [
      'Straight Cigarette / Pencil Pants (with Ankle Slit)',
      'Wide-Leg Flared Palazzo Pants',
      'Traditional Heavy-Pleat Patiala Salwar',
      'Classic Fitted Churidar',
      'Afghani / Pleated Cuff Balloon Salwar',
      'Kurti Stitching Only (No Bottom Required)',
    ],
    step3Label: '3. Select Neck Placket & Sleeve Style',
    step3Options: [
      'V-Neck Placket with Fabric Potli Buttons',
      'Mandarin / Chinese Collar Neck + 3/4th Sleeves',
      'Boat Neck with Keyhole + Bell Sleeves',
      'Organza / Cutwork Lace Trim on Sleeves & Daman',
      'Sweetheart Front + Deep Back with Tassel Dori',
      'Classic Round / Kurta Placket Neck',
    ],
    step4SectionTitle: '4. Bottom Waistband, Pockets & Suit Fabric Info',
    step4ChoiceLabel: 'Bottom Waistband Comfort Style',
    step4Choices: [
      'Flat Front Belt + Elasticated Back (MostFlattering & Comfortable)',
      'All-Around Full Elastic Waistband with Drawstring',
      'Traditional Nada (Drawstring) Waistband',
    ],
    customInfoFields: [
      {
        key: 'dressMaterialType',
        label: 'Your Dress Material / Fabric Type',
        placeholder: 'Select fabric type',
        type: 'select',
        options: [
          'Unstitched 3-Piece Salwar Dress Material (Top + Bottom + Dupatta)',
          'Silk / Chanderi / Banarasi Festive Suit Material',
          'Pure Cotton / Linen / Mulmul Daily & Office Fabric',
          'Convert Saree into Anarkali / Kurta Suit Set',
        ],
      },
      {
        key: 'pocketAndSlitNote',
        label: 'Pocket & Ankle Detail Preference',
        placeholder: 'e.g. Both-side mobile pockets in pant + potli buttons at ankle',
        type: 'text',
      },
      {
        key: 'liningCoverage',
        label: 'Cotton Lining Requirement',
        placeholder: 'Select lining coverage',
        type: 'select',
        options: [
          'Pure Cotton Lining in Kurta Only',
          'Pure Cotton Lining in Both Kurta & Pants',
          'Body-Only Lining (Sleeves Unlined)',
          'No Lining Required (Thick Cotton Fabric)',
        ],
      },
    ],
    step5Label: '5. Kurti & Salwar Finishing Add-ons',
    addons: [
      'Deep Concealed Smartphone Pocket in Pants & Kurti',
      'Handmade Fabric Potli Buttons on Neck & Sleeve Cuffs',
      'Organza / Crochet Lace Detailing on Sleeves & Hem',
      'Side-Slit Contrast Piping & Corner Reinforcement',
      '4-Side Dupatta Pico or Tassel Finishing',
    ],
    measurementTitle: '6. Kurti & Salwar Measurements (Inches)',
    measurementSubtitle:
      'Provide measurements for both top (kurti) and bottom (pants/salwar) in inches.',
    measurementFields: [
      { key: 'bustRound', label: 'Chest / Bust Round (in)', placeholder: 'e.g. 38', hint: 'Fullest chest round' },
      { key: 'waistRound', label: 'Kurti Waist Round (in)', placeholder: 'e.g. 33', hint: 'Narrowest waist part' },
      { key: 'hipRound', label: 'Hip Round (at Side Slit) (in)', placeholder: 'e.g. 40', hint: 'Around fullest hip' },
      { key: 'shoulder', label: 'Shoulder Width (in)', placeholder: 'e.g. 14.5', hint: 'Shoulder bone to bone' },
      { key: 'kurtiLength', label: 'Kurti / Anarkali Full Length (in)', placeholder: 'e.g. 44', hint: 'Shoulder to bottom hem' },
      { key: 'sleeveLength', label: 'Sleeve Length & Cuff Round (in)', placeholder: 'e.g. 16 / 10', hint: '3/4th or full sleeve' },
      { key: 'bottomLength', label: 'Pant / Salwar Length (in)', placeholder: 'e.g. 38', hint: 'Waist to ankle bone' },
      { key: 'bottomWaistThigh', label: 'Pant Waist & Thigh Round (in)', placeholder: 'e.g. 32 / 23', hint: 'Waist & mid-thigh' },
      { key: 'ankleOpening', label: 'Ankle / Mori Opening (in)', placeholder: 'e.g. 13', hint: 'Bottom cuff width' },
      { key: 'neckDepth', label: 'Front / Back Neck Depth (in)', placeholder: 'e.g. 6.5 / 4', hint: 'Neck dip preference' },
    ],
  },
];

export function getStitchingServiceBySlug(slug: string): StitchingServiceConfig | undefined {
  return STITCHING_SERVICES_CONFIG.find((s) => s.slug === slug);
}

