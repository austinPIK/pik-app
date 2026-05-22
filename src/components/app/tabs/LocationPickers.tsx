import React, { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Check, MapPin, Globe, ChevronDown } from "lucide-react";

// ─── Branding ────────────────────────────────────────────────────────────────
const LOGO_GRAD =
  "linear-gradient(135deg, #D4E8FB 0%, #9DC2F6 40%, #8C87F4 85%, #B99CF9 100%)";
const EASE = [0.22, 1, 0.36, 1] as const;

// ─── Country data ─────────────────────────────────────────────────────────────
export interface Country {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "AD", name: "Andorra", flag: "🇦🇩" },
  { code: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "AG", name: "Antigua & Barbuda", flag: "🇦🇬" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "AM", name: "Armenia", flag: "🇦🇲" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "BB", name: "Barbados", flag: "🇧🇧" },
  { code: "BY", name: "Belarus", flag: "🇧🇾" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "BZ", name: "Belize", flag: "🇧🇿" },
  { code: "BJ", name: "Benin", flag: "🇧🇯" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "BA", name: "Bosnia & Herzegovina", flag: "🇧🇦" },
  { code: "BW", name: "Botswana", flag: "🇧🇼" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "BN", name: "Brunei", flag: "🇧🇳" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "BI", name: "Burundi", flag: "🇧🇮" },
  { code: "CV", name: "Cape Verde", flag: "🇨🇻" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "CF", name: "Central African Republic", flag: "🇨🇫" },
  { code: "TD", name: "Chad", flag: "🇹🇩" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "KM", name: "Comoros", flag: "🇰🇲" },
  { code: "CG", name: "Congo", flag: "🇨🇬" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "CU", name: "Cuba", flag: "🇨🇺" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯" },
  { code: "DM", name: "Dominica", flag: "🇩🇲" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻" },
  { code: "GQ", name: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "ER", name: "Eritrea", flag: "🇪🇷" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "FJ", name: "Fiji", flag: "🇫🇯" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "GM", name: "Gambia", flag: "🇬🇲" },
  { code: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "GD", name: "Grenada", flag: "🇬🇩" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹" },
  { code: "GN", name: "Guinea", flag: "🇬🇳" },
  { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "GY", name: "Guyana", flag: "🇬🇾" },
  { code: "HT", name: "Haiti", flag: "🇭🇹" },
  { code: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "KI", name: "Kiribati", flag: "🇰🇮" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "LA", name: "Laos", flag: "🇱🇦" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸" },
  { code: "LR", name: "Liberia", flag: "🇱🇷" },
  { code: "LY", name: "Libya", flag: "🇱🇾" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬" },
  { code: "MW", name: "Malawi", flag: "🇲🇼" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "MV", name: "Maldives", flag: "🇲🇻" },
  { code: "ML", name: "Mali", flag: "🇲🇱" },
  { code: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "MH", name: "Marshall Islands", flag: "🇲🇭" },
  { code: "MR", name: "Mauritania", flag: "🇲🇷" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "FM", name: "Micronesia", flag: "🇫🇲" },
  { code: "MD", name: "Moldova", flag: "🇲🇩" },
  { code: "MC", name: "Monaco", flag: "🇲🇨" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "NA", name: "Namibia", flag: "🇳🇦" },
  { code: "NR", name: "Nauru", flag: "🇳🇷" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮" },
  { code: "NE", name: "Niger", flag: "🇳🇪" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "PW", name: "Palau", flag: "🇵🇼" },
  { code: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "KN", name: "Saint Kitts & Nevis", flag: "🇰🇳" },
  { code: "LC", name: "Saint Lucia", flag: "🇱🇨" },
  { code: "VC", name: "Saint Vincent & Grenadines", flag: "🇻🇨" },
  { code: "WS", name: "Samoa", flag: "🇼🇸" },
  { code: "SM", name: "San Marino", flag: "🇸🇲" },
  { code: "ST", name: "São Tomé & Príncipe", flag: "🇸🇹" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨" },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "SB", name: "Solomon Islands", flag: "🇸🇧" },
  { code: "SO", name: "Somalia", flag: "🇸🇴" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "SS", name: "South Sudan", flag: "🇸🇸" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "SD", name: "Sudan", flag: "🇸🇩" },
  { code: "SR", name: "Suriname", flag: "🇸🇷" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "SY", name: "Syria", flag: "🇸🇾" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "TL", name: "Timor-Leste", flag: "🇹🇱" },
  { code: "TG", name: "Togo", flag: "🇹🇬" },
  { code: "TO", name: "Tonga", flag: "🇹🇴" },
  { code: "TT", name: "Trinidad & Tobago", flag: "🇹🇹" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "TV", name: "Tuvalu", flag: "🇹🇻" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "YE", name: "Yemen", flag: "🇾🇪" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
];

// ─── Destination data ─────────────────────────────────────────────────────────
export interface Destination {
  name: string;
  countryCode: string;
  countryName: string;
  region?: string;
}

export const DESTINATIONS: Destination[] = [
  // Australia
  { name: "Sydney", countryCode: "AU", countryName: "Australia", region: "NSW" },
  { name: "Melbourne", countryCode: "AU", countryName: "Australia", region: "VIC" },
  { name: "Cairns", countryCode: "AU", countryName: "Australia", region: "Queensland" },
  { name: "Great Barrier Reef", countryCode: "AU", countryName: "Australia", region: "Queensland" },
  { name: "Uluru", countryCode: "AU", countryName: "Australia", region: "Northern Territory" },
  { name: "Gold Coast", countryCode: "AU", countryName: "Australia", region: "Queensland" },
  // France
  { name: "Paris", countryCode: "FR", countryName: "France" },
  { name: "Nice", countryCode: "FR", countryName: "France", region: "Côte d'Azur" },
  { name: "Lyon", countryCode: "FR", countryName: "France" },
  { name: "Bordeaux", countryCode: "FR", countryName: "France" },
  { name: "Marseille", countryCode: "FR", countryName: "France" },
  { name: "Provence", countryCode: "FR", countryName: "France" },
  // Italy
  { name: "Rome", countryCode: "IT", countryName: "Italy" },
  { name: "Florence", countryCode: "IT", countryName: "Italy", region: "Tuscany" },
  { name: "Venice", countryCode: "IT", countryName: "Italy" },
  { name: "Milan", countryCode: "IT", countryName: "Italy" },
  { name: "Amalfi Coast", countryCode: "IT", countryName: "Italy" },
  { name: "Cinque Terre", countryCode: "IT", countryName: "Italy" },
  { name: "Sicily", countryCode: "IT", countryName: "Italy" },
  { name: "Sardinia", countryCode: "IT", countryName: "Italy" },
  // Spain
  { name: "Barcelona", countryCode: "ES", countryName: "Spain" },
  { name: "Madrid", countryCode: "ES", countryName: "Spain" },
  { name: "Seville", countryCode: "ES", countryName: "Spain", region: "Andalusia" },
  { name: "Granada", countryCode: "ES", countryName: "Spain", region: "Andalusia" },
  { name: "Ibiza", countryCode: "ES", countryName: "Spain", region: "Balearic Islands" },
  { name: "Mallorca", countryCode: "ES", countryName: "Spain", region: "Balearic Islands" },
  { name: "San Sebastián", countryCode: "ES", countryName: "Spain", region: "Basque Country" },
  // Greece
  { name: "Santorini", countryCode: "GR", countryName: "Greece" },
  { name: "Mykonos", countryCode: "GR", countryName: "Greece" },
  { name: "Athens", countryCode: "GR", countryName: "Greece" },
  { name: "Crete", countryCode: "GR", countryName: "Greece" },
  { name: "Rhodes", countryCode: "GR", countryName: "Greece" },
  { name: "Corfu", countryCode: "GR", countryName: "Greece" },
  // Japan
  { name: "Tokyo", countryCode: "JP", countryName: "Japan" },
  { name: "Kyoto", countryCode: "JP", countryName: "Japan" },
  { name: "Osaka", countryCode: "JP", countryName: "Japan" },
  { name: "Hokkaido", countryCode: "JP", countryName: "Japan" },
  { name: "Hiroshima", countryCode: "JP", countryName: "Japan" },
  { name: "Nara", countryCode: "JP", countryName: "Japan" },
  { name: "Mount Fuji", countryCode: "JP", countryName: "Japan" },
  // Indonesia
  { name: "Bali", countryCode: "ID", countryName: "Indonesia" },
  { name: "Ubud", countryCode: "ID", countryName: "Indonesia", region: "Bali" },
  { name: "Lombok", countryCode: "ID", countryName: "Indonesia" },
  { name: "Komodo Island", countryCode: "ID", countryName: "Indonesia" },
  { name: "Jakarta", countryCode: "ID", countryName: "Indonesia" },
  { name: "Raja Ampat", countryCode: "ID", countryName: "Indonesia" },
  // Thailand
  { name: "Bangkok", countryCode: "TH", countryName: "Thailand" },
  { name: "Chiang Mai", countryCode: "TH", countryName: "Thailand" },
  { name: "Phuket", countryCode: "TH", countryName: "Thailand" },
  { name: "Koh Samui", countryCode: "TH", countryName: "Thailand" },
  { name: "Krabi", countryCode: "TH", countryName: "Thailand" },
  { name: "Koh Phi Phi", countryCode: "TH", countryName: "Thailand" },
  // Vietnam
  { name: "Hanoi", countryCode: "VN", countryName: "Vietnam" },
  { name: "Ho Chi Minh City", countryCode: "VN", countryName: "Vietnam" },
  { name: "Ha Long Bay", countryCode: "VN", countryName: "Vietnam" },
  { name: "Hoi An", countryCode: "VN", countryName: "Vietnam" },
  { name: "Da Nang", countryCode: "VN", countryName: "Vietnam" },
  { name: "Sapa", countryCode: "VN", countryName: "Vietnam" },
  // United States
  { name: "New York City", countryCode: "US", countryName: "United States", region: "New York" },
  { name: "Los Angeles", countryCode: "US", countryName: "United States", region: "California" },
  { name: "Miami", countryCode: "US", countryName: "United States", region: "Florida" },
  { name: "Chicago", countryCode: "US", countryName: "United States", region: "Illinois" },
  { name: "San Francisco", countryCode: "US", countryName: "United States", region: "California" },
  { name: "Las Vegas", countryCode: "US", countryName: "United States", region: "Nevada" },
  { name: "Maui", countryCode: "US", countryName: "United States", region: "Hawaii" },
  { name: "New Orleans", countryCode: "US", countryName: "United States", region: "Louisiana" },
  { name: "Nashville", countryCode: "US", countryName: "United States", region: "Tennessee" },
  // United Kingdom
  { name: "London", countryCode: "GB", countryName: "United Kingdom", region: "England" },
  { name: "Edinburgh", countryCode: "GB", countryName: "United Kingdom", region: "Scotland" },
  { name: "Oxford", countryCode: "GB", countryName: "United Kingdom", region: "England" },
  { name: "Bath", countryCode: "GB", countryName: "United Kingdom", region: "England" },
  { name: "Scottish Highlands", countryCode: "GB", countryName: "United Kingdom", region: "Scotland" },
  // Portugal
  { name: "Lisbon", countryCode: "PT", countryName: "Portugal" },
  { name: "Porto", countryCode: "PT", countryName: "Portugal" },
  { name: "Algarve", countryCode: "PT", countryName: "Portugal" },
  { name: "Madeira", countryCode: "PT", countryName: "Portugal" },
  { name: "Azores", countryCode: "PT", countryName: "Portugal" },
  // Morocco
  { name: "Marrakech", countryCode: "MA", countryName: "Morocco" },
  { name: "Fez", countryCode: "MA", countryName: "Morocco" },
  { name: "Casablanca", countryCode: "MA", countryName: "Morocco" },
  { name: "Sahara Desert", countryCode: "MA", countryName: "Morocco" },
  { name: "Essaouira", countryCode: "MA", countryName: "Morocco" },
  // UAE
  { name: "Dubai", countryCode: "AE", countryName: "United Arab Emirates" },
  { name: "Abu Dhabi", countryCode: "AE", countryName: "United Arab Emirates" },
  // Turkey
  { name: "Istanbul", countryCode: "TR", countryName: "Turkey" },
  { name: "Cappadocia", countryCode: "TR", countryName: "Turkey" },
  { name: "Bodrum", countryCode: "TR", countryName: "Turkey" },
  { name: "Antalya", countryCode: "TR", countryName: "Turkey" },
  // Mexico
  { name: "Mexico City", countryCode: "MX", countryName: "Mexico" },
  { name: "Tulum", countryCode: "MX", countryName: "Mexico", region: "Quintana Roo" },
  { name: "Cancún", countryCode: "MX", countryName: "Mexico", region: "Quintana Roo" },
  { name: "Oaxaca", countryCode: "MX", countryName: "Mexico" },
  { name: "Cabo San Lucas", countryCode: "MX", countryName: "Mexico", region: "Baja California Sur" },
  { name: "Guadalajara", countryCode: "MX", countryName: "Mexico" },
  // Brazil
  { name: "Rio de Janeiro", countryCode: "BR", countryName: "Brazil" },
  { name: "São Paulo", countryCode: "BR", countryName: "Brazil" },
  { name: "Amazon Rainforest", countryCode: "BR", countryName: "Brazil" },
  { name: "Fernando de Noronha", countryCode: "BR", countryName: "Brazil" },
  { name: "Florianópolis", countryCode: "BR", countryName: "Brazil" },
  // Peru
  { name: "Machu Picchu", countryCode: "PE", countryName: "Peru" },
  { name: "Lima", countryCode: "PE", countryName: "Peru" },
  { name: "Cusco", countryCode: "PE", countryName: "Peru" },
  { name: "Sacred Valley", countryCode: "PE", countryName: "Peru" },
  // Chile
  { name: "Torres del Paine", countryCode: "CL", countryName: "Chile", region: "Patagonia" },
  { name: "Santiago", countryCode: "CL", countryName: "Chile" },
  { name: "Atacama Desert", countryCode: "CL", countryName: "Chile" },
  // Argentina
  { name: "Buenos Aires", countryCode: "AR", countryName: "Argentina" },
  { name: "Patagonia", countryCode: "AR", countryName: "Argentina" },
  { name: "Mendoza", countryCode: "AR", countryName: "Argentina" },
  { name: "Bariloche", countryCode: "AR", countryName: "Argentina" },
  // South Africa
  { name: "Cape Town", countryCode: "ZA", countryName: "South Africa" },
  { name: "Johannesburg", countryCode: "ZA", countryName: "South Africa" },
  { name: "Kruger National Park", countryCode: "ZA", countryName: "South Africa" },
  { name: "Garden Route", countryCode: "ZA", countryName: "South Africa" },
  // Kenya
  { name: "Nairobi", countryCode: "KE", countryName: "Kenya" },
  { name: "Masai Mara", countryCode: "KE", countryName: "Kenya" },
  { name: "Amboseli", countryCode: "KE", countryName: "Kenya" },
  // Tanzania
  { name: "Zanzibar", countryCode: "TZ", countryName: "Tanzania" },
  { name: "Serengeti", countryCode: "TZ", countryName: "Tanzania" },
  { name: "Kilimanjaro", countryCode: "TZ", countryName: "Tanzania" },
  // Egypt
  { name: "Cairo", countryCode: "EG", countryName: "Egypt" },
  { name: "Luxor", countryCode: "EG", countryName: "Egypt" },
  { name: "Hurghada", countryCode: "EG", countryName: "Egypt" },
  { name: "Sharm el-Sheikh", countryCode: "EG", countryName: "Egypt" },
  // India
  { name: "Mumbai", countryCode: "IN", countryName: "India" },
  { name: "New Delhi", countryCode: "IN", countryName: "India" },
  { name: "Goa", countryCode: "IN", countryName: "India" },
  { name: "Jaipur", countryCode: "IN", countryName: "India", region: "Rajasthan" },
  { name: "Agra", countryCode: "IN", countryName: "India", region: "Uttar Pradesh" },
  { name: "Udaipur", countryCode: "IN", countryName: "India", region: "Rajasthan" },
  { name: "Kerala", countryCode: "IN", countryName: "India" },
  // Singapore
  { name: "Singapore", countryCode: "SG", countryName: "Singapore" },
  // Malaysia
  { name: "Kuala Lumpur", countryCode: "MY", countryName: "Malaysia" },
  { name: "Penang", countryCode: "MY", countryName: "Malaysia" },
  { name: "Langkawi", countryCode: "MY", countryName: "Malaysia" },
  // Maldives
  { name: "Malé Atoll", countryCode: "MV", countryName: "Maldives" },
  { name: "Baa Atoll", countryCode: "MV", countryName: "Maldives" },
  // Philippines
  { name: "Manila", countryCode: "PH", countryName: "Philippines" },
  { name: "Palawan", countryCode: "PH", countryName: "Philippines" },
  { name: "Boracay", countryCode: "PH", countryName: "Philippines" },
  { name: "Cebu", countryCode: "PH", countryName: "Philippines" },
  // Nepal
  { name: "Kathmandu", countryCode: "NP", countryName: "Nepal" },
  { name: "Pokhara", countryCode: "NP", countryName: "Nepal" },
  { name: "Everest Base Camp", countryCode: "NP", countryName: "Nepal" },
  // Germany
  { name: "Berlin", countryCode: "DE", countryName: "Germany" },
  { name: "Munich", countryCode: "DE", countryName: "Germany", region: "Bavaria" },
  { name: "Hamburg", countryCode: "DE", countryName: "Germany" },
  { name: "Bavaria", countryCode: "DE", countryName: "Germany" },
  // Netherlands
  { name: "Amsterdam", countryCode: "NL", countryName: "Netherlands" },
  // Switzerland
  { name: "Zürich", countryCode: "CH", countryName: "Switzerland" },
  { name: "Geneva", countryCode: "CH", countryName: "Switzerland" },
  { name: "Interlaken", countryCode: "CH", countryName: "Switzerland" },
  { name: "Zermatt", countryCode: "CH", countryName: "Switzerland" },
  // Austria
  { name: "Vienna", countryCode: "AT", countryName: "Austria" },
  { name: "Salzburg", countryCode: "AT", countryName: "Austria" },
  // Croatia
  { name: "Dubrovnik", countryCode: "HR", countryName: "Croatia" },
  { name: "Split", countryCode: "HR", countryName: "Croatia" },
  { name: "Hvar", countryCode: "HR", countryName: "Croatia" },
  { name: "Plitvice Lakes", countryCode: "HR", countryName: "Croatia" },
  // Iceland
  { name: "Reykjavik", countryCode: "IS", countryName: "Iceland" },
  { name: "Northern Lights", countryCode: "IS", countryName: "Iceland" },
  { name: "Golden Circle", countryCode: "IS", countryName: "Iceland" },
  // Norway
  { name: "Oslo", countryCode: "NO", countryName: "Norway" },
  { name: "Bergen", countryCode: "NO", countryName: "Norway" },
  { name: "Fjords", countryCode: "NO", countryName: "Norway" },
  // Canada
  { name: "Vancouver", countryCode: "CA", countryName: "Canada", region: "British Columbia" },
  { name: "Toronto", countryCode: "CA", countryName: "Canada", region: "Ontario" },
  { name: "Banff", countryCode: "CA", countryName: "Canada", region: "Alberta" },
  { name: "Quebec City", countryCode: "CA", countryName: "Canada", region: "Quebec" },
  // New Zealand
  { name: "Auckland", countryCode: "NZ", countryName: "New Zealand" },
  { name: "Queenstown", countryCode: "NZ", countryName: "New Zealand" },
  { name: "Milford Sound", countryCode: "NZ", countryName: "New Zealand" },
  // Jordan
  { name: "Petra", countryCode: "JO", countryName: "Jordan" },
  { name: "Wadi Rum", countryCode: "JO", countryName: "Jordan" },
  { name: "Amman", countryCode: "JO", countryName: "Jordan" },
  // Cambodia
  { name: "Siem Reap", countryCode: "KH", countryName: "Cambodia" },
  { name: "Angkor Wat", countryCode: "KH", countryName: "Cambodia" },
  // Sri Lanka
  { name: "Colombo", countryCode: "LK", countryName: "Sri Lanka" },
  { name: "Galle", countryCode: "LK", countryName: "Sri Lanka" },
  { name: "Ella", countryCode: "LK", countryName: "Sri Lanka" },
  // Georgia (country)
  { name: "Tbilisi", countryCode: "GE", countryName: "Georgia" },
  // Colombia
  { name: "Cartagena", countryCode: "CO", countryName: "Colombia" },
  { name: "Medellín", countryCode: "CO", countryName: "Colombia" },
  { name: "Bogotá", countryCode: "CO", countryName: "Colombia" },
];

// ─── SearchablePickerSheet ────────────────────────────────────────────────────
interface PickerItem {
  id: string;
  primary: string;
  secondary?: string;
  prefix?: string;
}

interface SearchablePickerSheetProps {
  title: string;
  placeholder: string;
  items: PickerItem[];
  selectedId?: string;
  onSelect: (item: PickerItem) => void;
  onClose: () => void;
  extraItem?: { label: string; onTap: () => void };
}

function SearchablePickerSheet({
  title,
  placeholder,
  items,
  selectedId,
  onSelect,
  onClose,
  extraItem,
}: SearchablePickerSheetProps) {
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => searchRef.current?.focus(), 320);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (it) =>
        it.primary.toLowerCase().includes(q) ||
        (it.secondary?.toLowerCase().includes(q) ?? false)
    );
  }, [query, items]);

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 800,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
        }}
      />

      {/* Sheet */}
      <motion.div
        key="sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.32, ease: EASE }}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 540,
          height: "80vh",
          background: "#0E1120",
          borderRadius: "24px 24px 0 0",
          border: "1px solid rgba(255,255,255,0.09)",
          borderBottom: "none",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          paddingBottom: "env(safe-area-inset-bottom)",
          boxShadow: "0 -8px 48px rgba(0,0,0,0.7)",
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: "rgba(255,255,255,0.18)",
          margin: "12px auto 0",
          flexShrink: 0,
        }} />

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px 12px",
          flexShrink: 0,
        }}>
          <p style={{
            fontSize: 17, fontWeight: 700, color: "#F5F7FF",
            margin: 0, letterSpacing: "-0.02em",
          }}>
            {title}
          </p>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={14} style={{ color: "rgba(245,247,255,0.7)" }} />
          </button>
        </div>

        {/* Search bar — pinned */}
        <div style={{ padding: "0 16px 10px", flexShrink: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.11)",
            borderRadius: 14, padding: "10px 14px",
          }}>
            <Search size={15} style={{ color: "rgba(245,247,255,0.4)", flexShrink: 0 }} />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                fontSize: 15, color: "#F5F7FF",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: 0,
                  display: "flex", alignItems: "center",
                }}
              >
                <X size={13} style={{ color: "rgba(245,247,255,0.35)" }} />
              </button>
            )}
          </div>
        </div>

        {/* Separator */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />

        {/* Scrollable list */}
        <div
          ref={listRef}
          style={{
            flex: 1, overflowY: "auto",
            WebkitOverflowScrolling: "touch",
          } as React.CSSProperties}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "rgba(245,247,255,0.35)", margin: 0 }}>
                No results for "{query}"
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const active = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => { onSelect(item); onClose(); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center",
                    gap: 14, padding: "13px 20px",
                    background: active ? "rgba(123,92,255,0.1)" : "transparent",
                    border: "none", cursor: "pointer",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    textAlign: "left",
                  }}
                >
                  {item.prefix && (
                    <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>
                      {item.prefix}
                    </span>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 15, fontWeight: active ? 700 : 500,
                      color: active ? "#C4DAFF" : "#F5F7FF",
                      margin: 0, lineHeight: 1.2,
                    }}>
                      {item.primary}
                    </p>
                    {item.secondary && (
                      <p style={{
                        fontSize: 11, color: "rgba(245,247,255,0.38)",
                        margin: "2px 0 0",
                      }}>
                        {item.secondary}
                      </p>
                    )}
                  </div>
                  {active && (
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: LOGO_GRAD, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Check size={12} style={{ color: "#fff" }} />
                    </div>
                  )}
                </button>
              );
            })
          )}

          {/* Custom destination option */}
          {extraItem && (
            <button
              onClick={() => { extraItem.onTap(); onClose(); }}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: 14, padding: "14px 20px",
                background: "transparent",
                border: "none",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                cursor: "pointer", textAlign: "left",
                marginTop: 4,
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: "rgba(138,160,255,0.12)",
                border: "1px dashed rgba(138,160,255,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <MapPin size={11} style={{ color: "#8AA0FF" }} />
              </div>
              <p style={{
                fontSize: 14, fontWeight: 600, color: "#8AA0FF", margin: 0,
              }}>
                {extraItem.label}
              </p>
            </button>
          )}

          {/* Bottom safe area spacer */}
          <div style={{ height: 20 }} />
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

// ─── Shared trigger field style ───────────────────────────────────────────────
const PICKER_FIELD_STYLE: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: 12,
  padding: "12px 14px",
  color: "#F5F7FF",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  textAlign: "left",
};

// ─── CountryPickerField ───────────────────────────────────────────────────────
interface CountryPickerFieldProps {
  value: string;
  onChange: (country: string) => void;
  hasError?: boolean;
}

export function CountryPickerField({ value, onChange, hasError }: CountryPickerFieldProps) {
  const [open, setOpen] = useState(false);

  const selected = useMemo(
    () => COUNTRIES.find((c) => c.name === value),
    [value]
  );

  const items: PickerItem[] = useMemo(
    () =>
      COUNTRIES.map((c) => ({
        id: c.name,
        primary: c.name,
        prefix: c.flag,
      })),
    []
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          ...PICKER_FIELD_STYLE,
          border: hasError
            ? "1px solid rgba(255,107,107,0.5)"
            : "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          <Globe size={14} style={{ color: "rgba(245,247,255,0.35)", flexShrink: 0 }} />
          {selected ? (
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18 }}>{selected.flag}</span>
              <span style={{ fontSize: 14, color: "#F5F7FF" }}>{selected.name}</span>
            </span>
          ) : (
            <span style={{ color: "rgba(245,247,255,0.35)" }}>Select country</span>
          )}
        </div>
        <ChevronDown size={14} style={{ color: "rgba(245,247,255,0.3)", flexShrink: 0 }} />
      </button>

      <AnimatePresence>
        {open && (
          <SearchablePickerSheet
            title="Select Country"
            placeholder="Search country…"
            items={items}
            selectedId={value}
            onSelect={(item) => onChange(item.primary)}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── DestinationPickerField ───────────────────────────────────────────────────
interface DestinationPickerFieldProps {
  value: string;
  selectedCountry?: string;
  onChange: (destination: string) => void;
  onCountryAutoFill?: (country: string) => void;
  hasError?: boolean;
}

export function DestinationPickerField({
  value,
  selectedCountry,
  onChange,
  onCountryAutoFill,
  hasError,
}: DestinationPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const customInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (customMode) {
      setCustomValue(value);
      setTimeout(() => customInputRef.current?.focus(), 50);
    }
  }, [customMode]);

  const items: PickerItem[] = useMemo(() => {
    let list = DESTINATIONS;
    if (selectedCountry) {
      const inCountry = DESTINATIONS.filter(
        (d) => d.countryName === selectedCountry
      );
      const others = DESTINATIONS.filter(
        (d) => d.countryName !== selectedCountry
      );
      list = [...inCountry, ...others];
    }
    return list.map((d) => {
      const country = COUNTRIES.find((c) => c.code === d.countryCode);
      return {
        id: d.name,
        primary: d.name,
        secondary: d.region
          ? `${d.countryName} · ${d.region}`
          : d.countryName,
        prefix: country?.flag,
      };
    });
  }, [selectedCountry]);

  const handleSelect = (item: PickerItem) => {
    onChange(item.primary);
    const dest = DESTINATIONS.find((d) => d.name === item.primary);
    if (dest && onCountryAutoFill && !selectedCountry) {
      onCountryAutoFill(dest.countryName);
    }
  };

  if (customMode) {
    return (
      <div style={{ display: "flex", gap: 8 }}>
        <input
          ref={customInputRef}
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
          onBlur={() => {
            if (customValue.trim()) onChange(customValue.trim());
            setCustomMode(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (customValue.trim()) onChange(customValue.trim());
              setCustomMode(false);
            }
            if (e.key === "Escape") {
              setCustomMode(false);
            }
          }}
          placeholder="Type your destination…"
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(138,160,255,0.4)",
            borderRadius: 12, padding: "12px 14px",
            color: "#F5F7FF", fontSize: 14, outline: "none",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={() => {
            if (customValue.trim()) onChange(customValue.trim());
            setCustomMode(false);
          }}
          style={{
            height: 46, paddingLeft: 14, paddingRight: 14,
            borderRadius: 12, background: LOGO_GRAD,
            border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 700, color: "#fff",
            whiteSpace: "nowrap", flexShrink: 0,
          }}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          ...PICKER_FIELD_STYLE,
          border: hasError
            ? "1px solid rgba(255,107,107,0.5)"
            : "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          <MapPin size={14} style={{ color: "rgba(245,247,255,0.35)", flexShrink: 0 }} />
          {value ? (
            <span style={{ fontSize: 14, color: "#F5F7FF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {value}
            </span>
          ) : (
            <span style={{ color: "rgba(245,247,255,0.35)" }}>
              {selectedCountry ? `Destinations in ${selectedCountry}` : "Select destination"}
            </span>
          )}
        </div>
        <ChevronDown size={14} style={{ color: "rgba(245,247,255,0.3)", flexShrink: 0 }} />
      </button>

      <AnimatePresence>
        {open && (
          <SearchablePickerSheet
            title="Select Destination"
            placeholder="Search destination…"
            items={items}
            selectedId={value}
            onSelect={handleSelect}
            onClose={() => setOpen(false)}
            extraItem={{
              label: "Use custom destination…",
              onTap: () => setCustomMode(true),
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
