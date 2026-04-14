"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Building,
  Home,
  Hash,
  Flag,
  ChevronRight,
  X,
  Globe,
  Camera,
  Calendar,
  Briefcase,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { FormGroup } from "@/components/common/FormGroup";
import { CommonCard } from "@/components/common/CommonCard";
import { PersistenceActions } from "@/components/common/PersistenceActions";

// High-Fidelity Location Hierarchy Data

const LOCATION_DATA: Record<
  string,
  Record<string, Record<string, string[]>>
> = {
  India: {
    "Tamil Nadu": {
      Tirunelveli: [
        "Palayamkottai",
        "Tenkasi",
        "Sankarankovil",
        "Ambasamudram",
        "Alangulam",
      ],
      Chennai: ["Adyar", "Mylapore", "T.Nagar", "Velachery", "Anna Nagar"],
      Coimbatore: [
        "Gandhipuram",
        "Peelamedu",
        "RS Puram",
        "Singanallur",
        "Saibaba Colony",
      ],
      Madurai: ["Anna Nagar", "K.Pudur", "Sellur", "Simmakkal", "Thallakulam"],
      Tuticorin: [
        "Meelavittan",
        "Muthiapuram",
        "Thermal Nagar",
        "Spic Nagar",
        "Harbour View",
      ],
    },
    Kerala: {
      Trivandrum: [
        "Pattom",
        "Vattiyoorkavu",
        "Kazhakkoottam",
        "Nemom",
        "Peroorkada",
      ],
      Kochi: [
        "Edappally",
        "Kadavanthra",
        "Vytila",
        "Palarivattom",
        "Fort Kochi",
      ],
      Kozhikode: [
        "Feroke",
        "Pantheeramkavu",
        "Beypore",
        "Mavoor",
        "Kunnamangalam",
      ],
      Thrissur: ["Puzhakkal", "Ollur", "Ayyanthole", "Mannuthy", "Nadathara"],
      Kottayam: [
        "Puthuppally",
        "Ettumanoor",
        "Changanassery",
        "Pala",
        "Vaikom",
      ],
    },
    Karnataka: {
      Bangalore: [
        "Indiranagar",
        "Koramangala",
        "Jayanagar",
        "Whitefield",
        "HSR Layout",
      ],
      Mysore: [
        "Jayalakshmipuram",
        "Vidyaranyapuram",
        "Gokulam",
        "Hebbal",
        "Kuvempunagar",
      ],
      Hubli: [
        "Vidyanagar",
        "Keshwapur",
        "Gokul Road",
        "Navnagar",
        "Bhairidevarakoppa",
      ],
      Mangalore: ["Bejai", "Kodialbail", "Kadri", "Kulshekar", "Mannagudda"],
      Belgaum: ["Tilakwadi", "Shahapur", "Angol", "Hindwadi", "Udyambag"],
    },
    Maharashtra: {
      Mumbai: ["Andheri", "Bandra", "Juhu", "Colaba", "Borivali"],
      Pune: ["Kothrud", "Hadapsar", "Baner", "Viman Nagar", "Hinjewadi"],
      Nagpur: ["Sitabuldi", "Dharampeth", "Ramdaspeth", "Sadar", "Civil Lines"],
      Nashik: ["Panchavati", "Indira Nagar", "Cidco", "Satpur", "Ambad"],
      Aurangabad: ["Cidco", "Waluj", "Paithan Road", "Beed Bypass", "Gulmandi"],
    },
    Delhi: {
      "Central Delhi": [
        "Connaught Place",
        "Karol Bagh",
        "Paharganj",
        "Rajender Nagar",
        "Civil Lines",
      ],
      "South Delhi": [
        "Saket",
        "Hauz Khas",
        "Greater Kailash",
        "Vasant Kunj",
        "Lajpat Nagar",
      ],
      "West Delhi": [
        "Rajouri Garden",
        "Punjabi Bagh",
        "Janakpuri",
        "Dwarka",
        "Tilak Nagar",
      ],
      "North Delhi": [
        "Rohini",
        "Pitampura",
        "Model Town",
        "Shalimar Bagh",
        "Ashok Vihar",
      ],
      "East Delhi": [
        "Laxmi Nagar",
        "Preet Vihar",
        "Mayur Vihar",
        "Patparganj",
        "Shahdara",
      ],
    },
  },
  USA: {
    California: {
      "Los Angeles": [
        "Santa Monica",
        "Hollywood",
        "Beverly Hills",
        "Pasadena",
        "Long Beach",
      ],
      "San Francisco": [
        "Mission District",
        "SoMa",
        "Richmond",
        "Sunset",
        "Castro",
      ],
      "San Diego": [
        "La Jolla",
        "Gaslamp Quarter",
        "North Park",
        "Pacific Beach",
        "Old Town",
      ],
      "San Jose": [
        "Willow Glen",
        "Downtown",
        "West San Jose",
        "Almaden",
        "Evergreen",
      ],
      Sacramento: ["Midtown", "Land Park", "East Sac", "Natomas", "Oak Park"],
    },
    Texas: {
      Houston: ["Midtown", "The Heights", "River Oaks", "Downtown", "Montrose"],
      Austin: [
        "South Congress",
        "East Austin",
        "Downtown",
        "Zilker",
        "Rainey Street",
      ],
      Dallas: [
        "Uptown",
        "Deep Ellum",
        "Oak Lawn",
        "Bishop Arts",
        "Lower Greenville",
      ],
      "San Antonio": [
        "The Pearl",
        "Southtown",
        "Downtown",
        "King William",
        "Alamo Heights",
      ],
      "Fort Worth": [
        "Downtown",
        "Stockyards",
        "Cultural District",
        "Fairmount",
        "Near Southside",
      ],
    },
    "New York": {
      "New York City": [
        "Manhattan",
        "Brooklyn",
        "Queens",
        "The Bronx",
        "Staten Island",
      ],
      Buffalo: [
        "Elmwood Village",
        "North Buffalo",
        "Allentown",
        "South Buffalo",
        "Parkside",
      ],
      Rochester: [
        "Park Ave",
        "South Wedge",
        "Highland Park",
        "North Winton Village",
        "Upper Monroe",
      ],
      Yonkers: [
        "Lincoln Park",
        "Ludlow",
        "Park Hill",
        "North West Yonkers",
        "Getty Square",
      ],
      Syracuse: ["Downtown", "Eastside", "Westside", "Northside", "Southside"],
    },
    Florida: {
      Miami: [
        "Brickell",
        "Wynwood",
        "Coconut Grove",
        "Little Havana",
        "Coral Gables",
      ],
      Orlando: [
        "Winter Park",
        "Thornton Park",
        "Lake Nona",
        "Downtown",
        "College Park",
      ],
      Tampa: [
        "Ybor City",
        "Hyde Park",
        "Downtown",
        "Westshore",
        "Seminole Heights",
      ],
      Jacksonville: [
        "Riverside",
        "San Marco",
        "Avondale",
        "Mandarin",
        "Springfield",
      ],
      "Fort Lauderdale": [
        "Las Olas",
        "Victoria Park",
        "Tarpon River",
        "Sailboat Bend",
        "Flagler Village",
      ],
    },
    Illinois: {
      Chicago: [
        "Lincoln Park",
        "Wicker Park",
        "Lakeview",
        "Logan Square",
        "Loops",
      ],
      Aurora: [
        "Far East",
        "West Side",
        "Near West",
        "North Aurora",
        "South Side",
      ],
      Naperville: [
        "Downtown",
        "White Eagle",
        "South Naperville",
        "North Naperville",
        "Ashbury",
      ],
      Joliet: [
        "West Side",
        "Near West",
        "East Side",
        "South Joliet",
        "North Joliet",
      ],
      Rockford: [
        "Downtown",
        "East Rockford",
        "West Rockford",
        "North Rockford",
        "South Rockford",
      ],
    },
  },
  UK: {
    England: {
      London: ["Westminster", "Camden", "Islington", "Greenwich", "Hackney"],
      Manchester: [
        "Deansgate",
        "Ancoats",
        "Northern Quarter",
        "Didsbury",
        "Chorlton",
      ],
      Birmingham: [
        "Edgbaston",
        "Moseley",
        "Harborne",
        "Jewellery Quarter",
        "Digbeth",
      ],
      Liverpool: ["Canning", "Aigburth", "Woolton", "Allerton", "Everton"],
      Bristol: ["Clifton", "Redland", "Montpelier", "Totterdown", "Bedminster"],
    },
    Scotland: {
      Edinburgh: [
        "Old Town",
        "New Town",
        "Leith",
        "Stockbridge",
        "Morningside",
      ],
      Glasgow: [
        "West End",
        "City Centre",
        "South Side",
        "East End",
        "Merchant City",
      ],
      Aberdeen: ["Ferryhill", "Rosemount", "Cults", "West End", "Footdee"],
      Dundee: [
        "Broughty Ferry",
        "West End",
        "City Centre",
        "Hilltown",
        "Lochee",
      ],
      Inverness: ["Crown", "Lochardil", "Merkinch", "Milton", "Culduthel"],
    },
    Wales: {
      Cardiff: ["Pontcanna", "Canton", "Roath", "Llandaff", "Llanishen"],
      Swansea: ["Mumbles", "Sketty", "Uplands", "Maritime Quarter", "Killay"],
      Newport: ["Caerleon", "Bassaleg", "Malpas", "St Julians", "Baneswell"],
      Wrexham: ["Gresford", "Rossett", "Marford", "Coedpoeth", "Llay"],
      Bangor: [
        "Upper Bangor",
        "Hirael",
        "Penrhosgarnedd",
        "Glanadda",
        "Maesgeirchen",
      ],
    },
    "Northern Ireland": {
      Belfast: [
        "Ballyhackamore",
        "Ormeau Road",
        "Lisburn Road",
        "Titanic Quarter",
        "Falls Road",
      ],
      Lisburn: ["Derriaghy", "Dunmurry", "Hilden", "Lambeg", "Magheralave"],
      Derry: ["Waterside", "Cityside", "Culmore", "Shantallow", "Bogside"],
      Newry: [
        "Ballybot",
        "Carnagat",
        "Drumalane",
        "Windsor Hill",
        "Monaghan Row",
      ],
      Armagh: [
        "English Street",
        "Scotch Street",
        "Irish Street",
        "Thomas Street",
        "Dobbin Street",
      ],
    },
    "Greater London": {
      Westminster: ["Soho", "Marylebone", "Mayfair", "Belgravia", "Pimlico"],
      Camden: [
        "Hampstead",
        "Highgate",
        "Kentish Town",
        "Primrose Hill",
        "Belsize Park",
      ],
      Islington: ["Angel", "Highbury", "Canonbury", "Clerkenwell", "Barnsbury"],
      Greenwich: ["Blackheath", "Eltham", "Charlton", "Woolwich", "Plumstead"],
      Hackney: [
        "Shoreditch",
        "Hoxton",
        "Dalston",
        "Stoke Newington",
        "Clapton",
      ],
    },
  },
  UAE: {
    Dubai: {
      "Downton Dubai": [
        "Burj Khalifa",
        "Business Bay",
        "DIFC",
        "City Walk",
        "Al Wasl",
      ],
      Marina: ["JBR", "JLT", "Bluewaters", "The Greens", "Barsha Heights"],
      Deira: ["Al Rigga", "Muraqqabat", "Naif", "Hor Al Anz", "Abu Hail"],
      "Bur Dubai": [
        "Al Karama",
        "Al Mankhool",
        "Al Jafiliya",
        "Oud Metha",
        "Al Hamriya",
      ],
      Jumeirah: [
        "Jumeirah 1",
        "Jumeirah 2",
        "Jumeirah 3",
        "Umm Suqeim",
        "Al Safa",
      ],
    },
    "Abu Dhabi": {
      Khalidiya: [
        "Corniche",
        "Al Bateen",
        "Al Mushrif",
        "Al Nahyan",
        "Al Rowdah",
      ],
      "Yas Island": [
        "Yas West",
        "Yas East",
        "Yas North",
        "Yas South",
        "Yas Gateway",
      ],
      "Saadiyat Island": [
        "Cultural District",
        "Beach District",
        "Marina District",
        "Resort District",
        "Eco District",
      ],
      "Reem Island": [
        "Marina Square",
        "Shams Abu Dhabi",
        "City of Lights",
        "Tamouh",
        "Najmat",
      ],
      "Al Maryah Island": [
        "Global Market",
        "Sowwah Square",
        "Galleria",
        "Rosewood",
        "Four Seasons",
      ],
    },
    Sharjah: {
      "Al Majaz": ["Majaz 1", "Majaz 2", "Majaz 3", "Buheirah", "Corniche"],
      "Al Nahda": [
        "Nahda South",
        "Nahda North",
        "Industrial Area 7",
        "Sahara",
        "Safeer",
      ],
      Muwaileh: [
        "University City",
        "Al Zahia",
        "Al Jada",
        "Muwaileh Commercial",
        "industrial 15",
      ],
      Mirdif: [
        "Mirdif West",
        "Mirdif East",
        "Uptown",
        "Mushrif Park",
        "Shorooq",
      ],
      "Al Khan": [
        "Khan Village",
        "Khan Beach",
        "Maryum Island",
        "Mamzar",
        "Khalidiya",
      ],
    },
    Ajman: {
      "Ajman Downtown": [
        "Al Nuaimia",
        "Al Rashidiya",
        "Al Bustan",
        "Al Nakheel",
        "Al Rumailah",
      ],
      "Al Mowaihat": [
        "Mowaihat 1",
        "Mowaihat 2",
        "Mowaihat 3",
        "Talla",
        "Shannouf",
      ],
      "Al Rawda": ["Rawda 1", "Rawda 2", "Rawda 3", "Jurf", "Hamidiya"],
      "Al Jurf": ["Jurf 1", "Jurf 2", "Jurf 3", "Ghuwaifat", "Zahra"],
      "Corniche Ajman": [
        "Beach Front",
        "Port Area",
        "Heritage District",
        "Marina",
        "Garden City",
      ],
    },
    RAK: {
      "Al Hamra Village": [
        "Hamra North",
        "Hamra South",
        "Hamra Marina",
        "Hamra Beach",
        "Royal Breeze",
      ],
      "Mina Al Arab": ["Bermuda", "Malibu", "Granada", "Flamingo", "Lagoon"],
      "Al Marjan Island": [
        "Breeze Island",
        "Treasure Island",
        "Dream Island",
        "View Island",
        "Coral Island",
      ],
      "RAK City": [
        "Al Nakheel",
        "Al Mamourah",
        "Al Juwais",
        "Al Dhait",
        "Al Oraibi",
      ],
      "Al Rams": [
        "Rams Beach",
        "Rams Harbour",
        "Rams Hill",
        "Rams Valley",
        "Rams Plain",
      ],
    },
  },
  Australia: {
    NSW: {
      Sydney: ["CBD", "Surry Hills", "Paddington", "Newton", "Bondi"],
      Newcastle: [
        "Merewether",
        "Hamilton",
        "Cooks Hill",
        "Newcastle East",
        "The Junction",
      ],
      Wollongong: [
        "North Wollongong",
        "Gwynneville",
        "Mount Keira",
        "Figtree",
        "Keiraville",
      ],
      Parramatta: [
        "Harris Park",
        "North Parramatta",
        "Westmead",
        "Rosehill",
        "Merrylands",
      ],
      "Central Coast": [
        "Gosford",
        "Wyong",
        "Terrigal",
        "The Entrance",
        "Woy Woy",
      ],
    },
    Victoria: {
      Melbourne: ["CBD", "Fitzroy", "South Yarra", "St Kilda", "Richmond"],
      Geelong: ["Newtown", "Belmont", "Highton", "Grovedale", "South Geelong"],
      Ballarat: [
        "Lake Wendouree",
        "Mount Clear",
        "Buninyong",
        "Sebastopol",
        "Wendouree",
      ],
      Bendigo: [
        "Strathdale",
        "Epsom",
        "Kangaroo Flat",
        "Flora Hill",
        "Golden Square",
      ],
      Mildura: [
        "Nichols Point",
        "Irymple",
        "Merbein",
        "Red Cliffs",
        "Cullulleraine",
      ],
    },
    Queensland: {
      Brisbane: [
        "Fortitude Valley",
        "West End",
        "New Farm",
        "South Brisbane",
        "Paddington",
      ],
      "Gold Coast": [
        "Surfers Paradise",
        "Broadbeach",
        "Burleigh Heads",
        "Coolangatta",
        "Southport",
      ],
      "Sunshine Coast": [
        "Noosa Heads",
        "Maroochydore",
        "Caloundra",
        "Mooloolaba",
        "Coolum",
      ],
      Townsville: [
        "North Ward",
        "Castle Hill",
        "Belgian Gardens",
        "Pimlico",
        "Mundingburra",
      ],
      Cairns: ["Edge Hill", "Whitfield", "Redlynch", "Freshwater", "Stratford"],
    },
    "Western Australia": {
      Perth: [
        "Subiaco",
        "Leederville",
        "Fremantle",
        "Cottesloe",
        "Mount Lawley",
      ],
      Mandurah: [
        "Halls Head",
        "Falcon",
        "Meadow Springs",
        "Silver Sands",
        "Dudley Park",
      ],
      Bunbury: [
        "East Bunbury",
        "South Bunbury",
        "College Grove",
        "Dalyellup",
        "Pelican Point",
      ],
      Geraldton: [
        "Mount Tarcoola",
        "Beachlands",
        "Wonthella",
        "Sunset Beach",
        "Beresford",
      ],
      Kalgoorlie: [
        "South Kalgoorlie",
        "Lamington",
        "Piccadilly",
        "Somerville",
        "Victory Heights",
      ],
    },
    "South Australia": {
      Adelaide: ["North Adelaide", "Stepney", "Dulwich", "Unley", "Glenelg"],
      "Mount Gambier": [
        "Glenburnie",
        "Suttontown",
        "Yahl",
        "Worrolong",
        "Square Mile",
      ],
      Whyalla: [
        "Whyalla Jenkins",
        "Whyalla Norrie",
        "Whyalla Playford",
        "Whyalla Stuart",
        "Whyalla Barson",
      ],
      Gawler: [
        "Gawler East",
        "Gawler South",
        "Gawler West",
        "Willaston",
        "Hewett",
      ],
      "Murray Bridge": [
        "Swanport",
        "Greenbanks",
        "Northern Heights",
        "Monarto",
        "Riverglades",
      ],
    },
  },
};

// Support component for Searchable Select
function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder,
  icon: Icon,
  disabled = false,
  error = "",
}: {
  value: string;
  onValueChange: (val: string) => void;
  options: string[];
  placeholder: string;
  icon: React.ElementType;
  disabled?: boolean;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="relative group">
      <div className="relative">
        <Icon
          className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${disabled ? "text-gray-200" : error ? "text-rose-400" : "text-gray-300 group-focus-within:text-blue-500"}`}
          size={16}
        />
        <Input
          value={open ? search : value || ""}
          onChange={(e) => {
            if (disabled) return;
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            if (disabled) return;
            setOpen(true);
            setSearch(""); // Clear search to show all options when clicking back
          }}
          onBlur={() => {
            // Delay closing to allow click selection
            setTimeout(() => setOpen(false), 200);
          }}
          readOnly={disabled}
          placeholder={placeholder}
          className={`h-10 pl-10 pr-10 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-xl transition-all text-[13px] shadow-sm ${disabled ? "bg-gray-50/50 cursor-default opacity-80" : error ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`}
        />
        {!disabled && (value || open) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onValueChange("");
              setSearch("");
            }}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-300 hover:text-rose-500 transition-colors p-1"
          >
            <X size={14} />
          </button>
        )}
        {!disabled && (
          <ChevronRight
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 transition-all duration-300 ${open ? "rotate-90" : "rotate-0"}`}
            size={16}
          />
        )}
      </div>

      {open && !disabled && (
        <div className="absolute z-50 w-full mt-2 py-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-xl max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          {filteredOptions.length > 0 ? (
            <>
              {/* Reset option at the top */}
              <button
                type="button"
                onMouseDown={() => {
                  onValueChange("");
                  setSearch("");
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-[13px] text-gray-400 italic hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors border-b border-gray-50 dark:border-gray-800/50"
              >
                {placeholder}
              </button>

              {filteredOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onMouseDown={() => {
                    onValueChange(opt);
                    setSearch(opt);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-[13px] hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors ${value === opt ? "text-blue-600 font-bold bg-blue-50/50" : "text-gray-600 dark:text-gray-300"}`}
                >
                  {opt}
                </button>
              ))}
            </>
          ) : (
            <div className="px-4 py-2 text-[12px] text-gray-400 italic">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import {
  useCreateVendorStaff,
  useUpdateVendorStaff,
  useReassignVendorStaffRole,
  useVendorStaffMember,
  VendorStaff,
} from "@/hooks/use-vendor-staff";
import { useVendorRoles } from "@/hooks/use-vendor-roles";

interface AddStaffContentProps {
  initialData?: any;
  isEdit?: boolean;
  isView?: boolean;
}

export default function AddStaffContent({
  initialData,
  isEdit = false,
  isView = false,
}: AddStaffContentProps) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const createMutation = useCreateVendorStaff();
  const updateMutation = useUpdateVendorStaff();
  const reassignRoleMutation = useReassignVendorStaffRole();
  const { data: memberData, isLoading } = useVendorStaffMember(id || "");
  const { data: rolesData } = useVendorRoles({ limit: 100 });

  const effectiveData = initialData || memberData;

  const [profilePic, setProfilePic] = useState<string | null>(
    effectiveData?.profile_pic || null,
  );
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: effectiveData?.name || "",
    designation: effectiveData?.designation || "",
    role_id: effectiveData?.role_id || "",
    mobile: effectiveData?.mobile || "",
    email: effectiveData?.email || "",
    password: "",
    address: effectiveData?.address || "",
    country: effectiveData?.country || "India",
    state: effectiveData?.state || "",
    district: effectiveData?.district || "",
    city: effectiveData?.city || "",
    locality: effectiveData?.locality || "",
    pincode: effectiveData?.pincode || "",
    dob: effectiveData?.dob || "",
    doj: effectiveData?.doj || "",
    dor: effectiveData?.dor || "",
    login_access: effectiveData?.login_access ?? true,
    work_status: effectiveData?.work_status || "active",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (effectiveData) {
      setFormData({
        name: effectiveData.name || "",
        designation: effectiveData.designation || "",
        role_id: effectiveData.role_id || "",
        dor: effectiveData.dor || "",
        mobile: effectiveData.mobile || "",
        email: effectiveData.email || "",
        password: "",
        address: effectiveData.address || "",
        country: effectiveData.country || "India",
        state: effectiveData.state || "",
        district: effectiveData.district || "",
        city: effectiveData.city || "",
        locality: effectiveData.locality || "",
        pincode: effectiveData.pincode || "",
        dob: effectiveData.dob || "",
        doj: effectiveData.doj || "",
        login_access: effectiveData.login_access ?? true,
        work_status: effectiveData.work_status || "active",
      });
      setProfilePic(effectiveData.profile_pic || null);
    }
  }, [effectiveData]);

  // Dynamic Options derived from Hierarchy
  const countryOptions = useMemo(() => Object.keys(LOCATION_DATA), []);

  const stateOptions = useMemo(() => {
    if (!formData.country || !LOCATION_DATA[formData.country]) return [];
    return Object.keys(LOCATION_DATA[formData.country]);
  }, [formData.country]);

  const districtOptions = useMemo(() => {
    if (
      !formData.country ||
      !formData.state ||
      !LOCATION_DATA[formData.country]?.[formData.state]
    )
      return [];
    return Object.keys(LOCATION_DATA[formData.country][formData.state]);
  }, [formData.country, formData.state]);

  const cityOptions = useMemo(() => {
    if (
      !formData.country ||
      !formData.state ||
      !formData.district ||
      !LOCATION_DATA[formData.country]?.[formData.state]?.[formData.district]
    )
      return [];
    return LOCATION_DATA[formData.country][formData.state][formData.district];
  }, [formData.country, formData.state, formData.district]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        if (errors.profilePic)
          setErrors((prev) => ({ ...prev, profilePic: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.role_id) newErrors.designation = "Designation is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.email) newErrors.email = "Email address is required";
    if (!id && !formData.password) newErrors.password = "Password is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.doj) newErrors.doj = "Joining date is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!profilePic) newErrors.profilePic = "Profile picture is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly.");
      return;
    }

    if (id) {
      // On edit: update profile fields (role_id excluded — use dedicated endpoint)
      const { role_id, ...profileFields } = formData;
      await updateMutation.mutateAsync({
        id: parseInt(id),
        data: { ...profileFields, profile_pic: profilePic },
      });

      // If role changed, fire the dedicated role reassignment endpoint
      const originalRoleId = effectiveData?.role_id;
      if (role_id && String(role_id) !== String(originalRoleId)) {
        await reassignRoleMutation.mutateAsync({ id: parseInt(id), role_id });
      }
    } else {
      await createMutation.mutateAsync({
        ...formData,
        profile_pic: profilePic,
      });
    }

    router.push("/staff");
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-4 sm:px-6 lg:px-8 pt-2 pb-10 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-4 mt-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight flex items-center gap-2">
                {params.id
                  ? isView
                    ? "EMPLOYEE DETAILS"
                    : "EDIT EMPLOYEE"
                  : "ADD STAFF"}
              </h1>
              <Badge className="bg-blue-600/10 text-blue-600 border-none px-3 py-1 font-black text-[10px] tracking-widest uppercase rounded-lg">
                STAFF
              </Badge>
            </div>
            <p className="text-sm font-medium text-gray-400">
              Enter the employee&apos;s professional details to manage their
              profile.
            </p>
          </div>
        </div>

        <div
          className={`flex flex-col lg:flex-row gap-8 ${!isView ? "pb-20" : ""}`}
        >
          {/* Main Form Area */}
          <div className={`flex-[2] space-y-6`}>
            <CommonCard
              title="Personal Information"
              subtitle="Personal and professional basics"
              icon={User}
              isView={isView}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Name */}
                <FormGroup
                  label="Full Name"
                  icon={User}
                  error={errors.name}
                  required
                  isView={isView}
                >
                  <Input
                    value={formData.name}
                    onChange={(e) => {
                      !isView &&
                        setFormData({ ...formData, name: e.target.value });
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    readOnly={isView}
                    placeholder="Enter full name"
                    className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm shadow-sm ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : errors.name ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`}
                  />
                </FormGroup>

                {/* Mobile */}
                <FormGroup
                  label="Mobile Number"
                  icon={Phone}
                  error={errors.mobile}
                  required
                  isView={isView}
                >
                  <Input
                    value={formData.mobile}
                    onChange={(e) => {
                      !isView &&
                        setFormData({ ...formData, mobile: e.target.value });
                      if (errors.mobile)
                        setErrors((prev) => ({ ...prev, mobile: "" }));
                    }}
                    readOnly={isView}
                    placeholder="Enter mobile number"
                    className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm shadow-sm ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : errors.mobile ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`}
                  />
                </FormGroup>

                {/* Email */}
                <FormGroup
                  label="Email Address"
                  icon={Mail}
                  error={errors.email}
                  required
                  isView={isView}
                >
                  <Input
                    value={formData.email}
                    autoComplete="off"
                    onChange={(e) => {
                      !isView &&
                        setFormData({ ...formData, email: e.target.value });
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    readOnly={isView}
                    placeholder="Enter email address"
                    className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm shadow-sm ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : errors.email ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`}
                  />
                </FormGroup>

                {/* Password */}
                <FormGroup
                  label="Account Password"
                  icon={Lock}
                  error={errors.password}
                  required={!params.id}
                  isView={isView}
                >
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => {
                      !isView &&
                        setFormData({ ...formData, password: e.target.value });
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    readOnly={isView}
                    placeholder="Enter password"
                    className={`h-12 pl-12 pr-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm shadow-sm ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : errors.password ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`}
                  />
                  {!isView && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors z-10"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  )}
                </FormGroup>

                {/* DOB */}
                <FormGroup
                  label="Date of Birth"
                  icon={Calendar}
                  error={errors.dob}
                  required
                  isView={isView}
                >
                  <Input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => {
                      !isView &&
                        setFormData({ ...formData, dob: e.target.value });
                      if (errors.dob)
                        setErrors((prev) => ({ ...prev, dob: "" }));
                    }}
                    readOnly={isView}
                    className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm shadow-sm ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : errors.dob ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`}
                  />
                </FormGroup>
              </div>
            </CommonCard>

            <CommonCard
              title="Staff Information"
              subtitle="Designation and employment dates"
              icon={Briefcase}
              iconColorClass="text-emerald-600"
              iconBgClass="bg-emerald-50 dark:bg-emerald-500/10"
              isView={isView}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Designation */}
                <FormGroup
                  label="Designation"
                  icon={Briefcase}
                  error={errors.designation}
                  required
                  isView={isView}
                >
                  {isView ? (
                    <Input
                      value={formData.designation}
                      readOnly
                      className="h-12 pl-12 focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800 rounded-2xl text-sm"
                    />
                  ) : (
                    <Select
                      value={formData.role_id ? String(formData.role_id) : ""}
                      onValueChange={(val) => {
                        const selectedRole = rolesData?.data?.find(
                          (r) => String(r.id) === val,
                        );
                        setFormData({
                          ...formData,
                          role_id: val,
                          designation: selectedRole?.name || "",
                        });
                        if (errors.designation)
                          setErrors((prev) => ({ ...prev, designation: "" }));
                      }}
                    >
                      <SelectTrigger
                        className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl text-sm shadow-sm ${errors.designation ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`}
                      >
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        {(rolesData?.data ?? []).map((role) => (
                          <SelectItem key={role.id} value={String(role.id)}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormGroup>

                {/* DOJ */}
                <FormGroup
                  label="Date of Joining"
                  icon={Calendar}
                  error={errors.doj}
                  required
                  isView={isView}
                >
                  <Input
                    type="date"
                    value={formData.doj}
                    onChange={(e) => {
                      !isView &&
                        setFormData({ ...formData, doj: e.target.value });
                      if (errors.doj)
                        setErrors((prev) => ({ ...prev, doj: "" }));
                    }}
                    readOnly={isView}
                    className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm shadow-sm ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : errors.doj ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`}
                  />
                </FormGroup>

                {/* DOR */}
                <FormGroup
                  label="Date of Relieving"
                  icon={Calendar}
                  error={errors.dor}
                  isView={isView}
                >
                  <Input
                    type="date"
                    value={formData.dor}
                    onChange={(e) => {
                      !isView &&
                        setFormData({ ...formData, dor: e.target.value });
                      if (errors.dor)
                        setErrors((prev) => ({ ...prev, dor: "" }));
                    }}
                    readOnly={isView}
                    className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl transition-all text-sm shadow-sm ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : errors.dor ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`}
                  />
                </FormGroup>
              </div>
            </CommonCard>

            <CommonCard
              title="Address Details"
              subtitle="Physical location and contact info"
              icon={MapPin}
              iconColorClass="text-orange-600"
              iconBgClass="bg-orange-50 dark:bg-orange-500/10"
              isView={isView}
            >
              <div className="space-y-6">
                <FormGroup
                  label="Street Address"
                  icon={Home}
                  error={errors.address}
                  required
                  isView={isView}
                >
                  <textarea
                    value={formData.address}
                    onChange={(e) => {
                      !isView &&
                        setFormData({ ...formData, address: e.target.value });
                      if (errors.address)
                        setErrors((prev) => ({ ...prev, address: "" }));
                    }}
                    readOnly={isView}
                    placeholder="Enter full address"
                    className={`w-full pl-12 pr-3 py-3 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-2xl outline-none transition-all text-sm min-h-[100px] resize-none shadow-sm ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : errors.address ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`}
                  />
                </FormGroup>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Country */}
                  <FormGroup
                    label="Country"
                    required
                    isView={isView}
                    error={errors.country}
                  >
                    <SearchableSelect
                      value={formData.country}
                      onValueChange={(val) => {
                        !isView &&
                          setFormData({
                            ...formData,
                            country: val,
                            state: "",
                            district: "",
                            city: "",
                          });
                        if (errors.country)
                          setErrors((prev) => ({ ...prev, country: "" }));
                      }}
                      options={countryOptions}
                      placeholder="Select Country"
                      icon={Flag}
                      disabled={isView}
                      error={errors.country}
                    />
                  </FormGroup>

                  {/* State */}
                  <FormGroup
                    label="State"
                    required
                    isView={isView}
                    error={errors.state}
                  >
                    <SearchableSelect
                      value={formData.state}
                      onValueChange={(val) => {
                        !isView &&
                          setFormData({
                            ...formData,
                            state: val,
                            district: "",
                            city: "",
                          });
                        if (errors.state)
                          setErrors((prev) => ({ ...prev, state: "" }));
                      }}
                      options={stateOptions}
                      placeholder={
                        formData.country
                          ? "Select State"
                          : "Select Country First"
                      }
                      icon={Globe}
                      disabled={isView || stateOptions.length === 0}
                      error={errors.state}
                    />
                  </FormGroup>

                  {/* District */}
                  <FormGroup
                    label="District"
                    required
                    isView={isView}
                    error={errors.district}
                  >
                    <SearchableSelect
                      value={formData.district}
                      onValueChange={(val) => {
                        !isView &&
                          setFormData({ ...formData, district: val, city: "" });
                        if (errors.district)
                          setErrors((prev) => ({ ...prev, district: "" }));
                      }}
                      options={districtOptions}
                      placeholder={
                        formData.state
                          ? "Select District"
                          : "Select State First"
                      }
                      icon={Building}
                      disabled={isView || districtOptions.length === 0}
                      error={errors.district}
                    />
                  </FormGroup>

                  {/* City */}
                  <FormGroup
                    label="City"
                    required
                    isView={isView}
                    error={errors.city}
                  >
                    <SearchableSelect
                      value={formData.city}
                      onValueChange={(val) => {
                        !isView && setFormData({ ...formData, city: val });
                        if (errors.city)
                          setErrors((prev) => ({ ...prev, city: "" }));
                      }}
                      options={cityOptions}
                      placeholder={
                        formData.district
                          ? "Select City"
                          : "Select District First"
                      }
                      icon={Building}
                      disabled={isView || cityOptions.length === 0}
                      error={errors.city}
                    />
                  </FormGroup>

                  {/* Locality */}
                  <FormGroup
                    label="Locality"
                    icon={MapPin}
                    error={errors.locality}
                    required
                    isView={isView}
                  >
                    <Input
                      value={formData.locality}
                      onChange={(e) => {
                        !isView &&
                          setFormData({
                            ...formData,
                            locality: e.target.value,
                          });
                        if (errors.locality)
                          setErrors((prev) => ({ ...prev, locality: "" }));
                      }}
                      readOnly={isView}
                      placeholder="Enter locality"
                      className={`h-10 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-xl transition-all text-[13px] shadow-sm ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : errors.locality ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`}
                    />
                  </FormGroup>

                  {/* Pincode */}
                  <FormGroup
                    label="Pincode"
                    icon={Hash}
                    error={errors.pincode}
                    required
                    isView={isView}
                  >
                    <Input
                      value={formData.pincode}
                      onChange={(e) => {
                        !isView &&
                          setFormData({ ...formData, pincode: e.target.value });
                        if (errors.pincode)
                          setErrors((prev) => ({ ...prev, pincode: "" }));
                      }}
                      readOnly={isView}
                      placeholder="Enter pincode"
                      className={`h-10 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-xl transition-all text-[13px] shadow-sm ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : errors.pincode ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5"}`}
                    />
                  </FormGroup>
                </div>
              </div>
            </CommonCard>
          </div>

          {/* Right Column - Sidebar */}
          <div className="flex-1 space-y-8 lg:sticky lg:top-8">
            {/* Action Buttons - Top of Sidebar */}
            {!isView && (
              <div className="bg-white dark:bg-sidebar/50 backdrop-blur-md p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <PersistenceActions
                  onSave={handleSubmit}
                  onCancel={() => router.push("/staff")}
                  saveLabel="SAVE STAFF"
                />
              </div>
            )}

            {/* Section 4: Photo Card */}
            <div className="bg-white dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm text-center">
              <div className="relative w-32 h-32 mx-auto mb-6 group cursor-pointer">
                <div
                  className={`absolute inset-0 rounded-full bg-blue-500/10 ${!isView && "group-hover:bg-blue-500/20"} transition-all duration-300`}
                />
                <Avatar className="w-full h-full rounded-full border-4 border-white dark:border-gray-800 shadow-xl transition-transform duration-300 group-hover:scale-[1.02]">
                  <AvatarImage src={profilePic || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-none transition-all">
                    <User size={48} className="text-gray-300" />
                  </AvatarFallback>
                </Avatar>
                {!isView && (
                  <label className="absolute bottom-1 right-1 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition-all border-4 border-white dark:border-[#1f2937] active:scale-95 z-20">
                    <Camera size={18} />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
              <h3 className="text-sm font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest">
                PROFILE PICTURE{" "}
                {!isView && <span className="text-red-500 ml-1">*</span>}
              </h3>
              <FormGroup
                label=""
                error={errors.profilePic}
                isView={isView}
                className="p-0 space-y-0 translate-y--2"
              >
                <div /> {/* Invisible children for FormGroup spacing */}
              </FormGroup>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-2 italic">
                MAX 10MB
              </p>
            </div>

            {/* Section 5: Access & Status */}
            <div className="bg-white dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm space-y-8">
              {/* Login Access Toggle */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                  <h3 className="text-[12px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-[0.2em]">
                    LOGIN ACCESS
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() =>
                      !isView &&
                      setFormData({ ...formData, login_access: true })
                    }
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 ${formData.login_access ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 hover:brightness-110 active:scale-95" : "text-gray-400 hover:text-gray-600"} ${isView ? "cursor-default" : ""}`}
                  >
                    <ShieldCheck size={14} /> Allow
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      !isView &&
                      setFormData({ ...formData, login_access: false })
                    }
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 ${!formData.login_access ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-0.5 hover:brightness-110 active:scale-95" : "text-gray-400 hover:text-gray-600"} ${isView ? "cursor-default" : ""}`}
                  >
                    <ShieldAlert size={14} /> Deny
                  </button>
                </div>
              </div>

              {/* Employee Status */}
              <div className="space-y-4">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  EMPLOYEE STATUS
                </p>
                <Select
                  value={formData.work_status}
                  onValueChange={(val) =>
                    !isView && setFormData({ ...formData, work_status: val })
                  }
                  disabled={isView}
                >
                  <SelectTrigger className="w-full h-12 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl focus:ring-0 transition-all font-bold text-[13px]">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-gray-100">
                    <SelectItem value="active" className="rounded-xl">
                      Active
                    </SelectItem>
                    <SelectItem value="inactive" className="rounded-xl">
                      Inactive
                    </SelectItem>
                    <SelectItem value="resigned" className="rounded-xl">
                      Resigned
                    </SelectItem>
                    <SelectItem value="relieved" className="rounded-xl">
                      Relieved
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
