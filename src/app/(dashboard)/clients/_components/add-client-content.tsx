"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Flag, 
  Building, 
  Home, 
  Hash, 
  Camera, 
  Check, 
  X,
  ArrowLeft,
  AlertCircle,
  ChevronRight,
  Globe,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FormGroup } from "@/components/common/FormGroup";
import { CommonCard } from "@/components/common/CommonCard";
import { ActionFooter } from "@/components/common/ActionFooter";

// High-Fidelity Location Hierarchy Data
const LOCATION_DATA: Record<string, any> = {
  "India": {
    "Tamil Nadu": {
      "Tirunelveli": ["Palayamkottai", "Tenkasi", "Sankarankovil", "Ambasamudram", "Alangulam"],
      "Chennai": ["Adyar", "Mylapore", "T.Nagar", "Velachery", "Anna Nagar"],
      "Coimbatore": ["Gandhipuram", "Peelamedu", "RS Puram", "Singanallur", "Saibaba Colony"],
      "Madurai": ["Anna Nagar", "K.Pudur", "Sellur", "Simmakkal", "Thallakulam"],
      "Tuticorin": ["Meelavittan", "Muthiapuram", "Thermal Nagar", "Spic Nagar", "Harbour View"]
    },
    "Kerala": {
      "Trivandrum": ["Pattom", "Vattiyoorkavu", "Kazhakkoottam", "Nemom", "Peroorkada"],
      "Kochi": ["Edappally", "Kadavanthra", "Vytila", "Palarivattom", "Fort Kochi"],
      "Kozhikode": ["Feroke", "Pantheeramkavu", "Beypore", "Mavoor", "Kunnamangalam"],
      "Thrissur": ["Puzhakkal", "Ollur", "Ayyanthole", "Mannuthy", "Nadathara"],
      "Kottayam": ["Puthuppally", "Ettumanoor", "Changanassery", "Pala", "Vaikom"]
    },
    "Karnataka": {
      "Bangalore": ["Indiranagar", "Koramangala", "Jayanagar", "Whitefield", "HSR Layout"],
      "Mysore": ["Jayalakshmipuram", "Vidyaranyapuram", "Gokulam", "Hebbal", "Kuvempunagar"],
      "Hubli": ["Vidyanagar", "Keshwapur", "Gokul Road", "Navnagar", "Bhairidevarakoppa"],
      "Mangalore": ["Bejai", "Kodialbail", "Kadri", "Kulshekar", "Mannagudda"],
      "Belgaum": ["Tilakwadi", "Shahapur", "Angol", "Hindwadi", "Udyambag"]
    },
    "Maharashtra": {
      "Mumbai": ["Andheri", "Bandra", "Juhu", "Colaba", "Borivali"],
      "Pune": ["Kothrud", "Hadapsar", "Baner", "Viman Nagar", "Hinjewadi"],
      "Nagpur": ["Sitabuldi", "Dharampeth", "Ramdaspeth", "Sadar", "Civil Lines"],
      "Nashik": ["Panchavati", "Indira Nagar", "Cidco", "Satpur", "Ambad"],
      "Aurangabad": ["Cidco", "Waluj", "Paithan Road", "Beed Bypass", "Gulmandi"]
    },
    "Delhi": {
      "Central Delhi": ["Connaught Place", "Karol Bagh", "Paharganj", "Rajender Nagar", "Civil Lines"],
      "South Delhi": ["Saket", "Hauz Khas", "Greater Kailash", "Vasant Kunj", "Lajpat Nagar"],
      "West Delhi": ["Rajouri Garden", "Punjabi Bagh", "Janakpuri", "Dwarka", "Tilak Nagar"],
      "North Delhi": ["Rohini", "Pitampura", "Model Town", "Shalimar Bagh", "Ashok Vihar"],
      "East Delhi": ["Laxmi Nagar", "Preet Vihar", "Mayur Vihar", "Patparganj", "Shahdara"]
    }
  },
  "USA": {
    "California": {
      "Los Angeles": ["Santa Monica", "Hollywood", "Beverly Hills", "Pasadena", "Long Beach"],
      "San Francisco": ["Mission District", "SoMa", "Richmond", "Sunset", "Castro"],
      "San Diego": ["La Jolla", "Gaslamp Quarter", "North Park", "Pacific Beach", "Old Town"],
      "San Jose": ["Willow Glen", "Downtown", "West San Jose", "Almaden", "Evergreen"],
      "Sacramento": ["Midtown", "Land Park", "East Sac", "Natomas", "Oak Park"]
    },
    "Texas": {
      "Houston": ["Midtown", "The Heights", "River Oaks", "Downtown", "Montrose"],
      "Austin": ["South Congress", "East Austin", "Downtown", "Zilker", "Rainey Street"],
      "Dallas": ["Uptown", "Deep Ellum", "Oak Lawn", "Bishop Arts", "Lower Greenville"],
      "San Antonio": ["The Pearl", "Southtown", "Downtown", "King William", "Alamo Heights"],
      "Fort Worth": ["Downtown", "Stockyards", "Cultural District", "Fairmount", "Near Southside"]
    },
    "New York": {
      "New York City": ["Manhattan", "Brooklyn", "Queens", "The Bronx", "Staten Island"],
      "Buffalo": ["Elmwood Village", "North Buffalo", "Allentown", "South Buffalo", "Parkside"],
      "Rochester": ["Park Ave", "South Wedge", "Highland Park", "North Winton Village", "Upper Monroe"],
      "Yonkers": ["Lincoln Park", "Ludlow", "Park Hill", "North West Yonkers", "Getty Square"],
      "Syracuse": ["Downtown", "Eastside", "Westside", "Northside", "Southside"]
    },
    "Florida": {
      "Miami": ["Brickell", "Wynwood", "Coconut Grove", "Little Havana", "Coral Gables"],
      "Orlando": ["Winter Park", "Thornton Park", "Lake Nona", "Downtown", "College Park"],
      "Tampa": ["Ybor City", "Hyde Park", "Downtown", "Westshore", "Seminole Heights"],
      "Jacksonville": ["Riverside", "San Marco", "Avondale", "Mandarin", "Springfield"],
      "Fort Lauderdale": ["Las Olas", "Victoria Park", "Tarpon River", "Sailboat Bend", "Flagler Village"]
    },
    "Illinois": {
      "Chicago": ["Lincoln Park", "Wicker Park", "Lakeview", "Logan Square", "Loops"],
      "Aurora": ["Far East", "West Side", "Near West", "North Aurora", "South Side"],
      "Naperville": ["Downtown", "White Eagle", "South Naperville", "North Naperville", "Ashbury"],
      "Joliet": ["West Side", "Near West", "East Side", "South Joliet", "North Joliet"],
      "Rockford": ["Downtown", "East Rockford", "West Rockford", "North Rockford", "South Rockford"]
    }
  },
  "UK": {
    "England": {
      "London": ["Westminster", "Camden", "Islington", "Greenwich", "Hackney"],
      "Manchester": ["Deansgate", "Ancoats", "Northern Quarter", "Didsbury", "Chorlton"],
      "Birmingham": ["Edgbaston", "Moseley", "Harborne", "Jewellery Quarter", "Digbeth"],
      "Liverpool": ["Canning", "Aigburth", "Woolton", "Allerton", "Everton"],
      "Bristol": ["Clifton", "Redland", "Montpelier", "Totterdown", "Bedminster"]
    },
    "Scotland": {
      "Edinburgh": ["Old Town", "New Town", "Leith", "Stockbridge", "Morningside"],
      "Glasgow": ["West End", "City Centre", "South Side", "East End", "Merchant City"],
      "Aberdeen": ["Ferryhill", "Rosemount", "Cults", "West End", "Footdee"],
      "Dundee": ["Broughty Ferry", "West End", "City Centre", "Hilltown", "Lochee"],
      "Inverness": ["Crown", "Lochardil", "Merkinch", "Milton", "Culduthel"]
    },
    "Wales": {
      "Cardiff": ["Pontcanna", "Canton", "Roath", "Llandaff", "Llanishen"],
      "Swansea": ["Mumbles", "Sketty", "Uplands", "Maritime Quarter", "Killay"],
      "Newport": ["Caerleon", "Bassaleg", "Malpas", "St Julians", "Baneswell"],
      "Wrexham": ["Gresford", "Rossett", "Marford", "Coedpoeth", "Llay"],
      "Bangor": ["Upper Bangor", "Hirael", "Penrhosgarnedd", "Glanadda", "Maesgeirchen"]
    },
    "Northern Ireland": {
      "Belfast": ["Ballyhackamore", "Ormeau Road", "Lisburn Road", "Titanic Quarter", "Falls Road"],
      "Lisburn": ["Derriaghy", "Dunmurry", "Hilden", "Lambeg", "Magheralave"],
      "Derry": ["Waterside", "Cityside", "Culmore", "Shantallow", "Bogside"],
      "Newry": ["Ballybot", "Carnagat", "Drumalane", "Windsor Hill", "Monaghan Row"],
      "Armagh": ["English Street", "Scotch Street", "Irish Street", "Thomas Street", "Dobbin Street"]
    },
    "Greater London": {
      "Westminster": ["Soho", "Marylebone", "Mayfair", "Belgravia", "Pimlico"],
      "Camden": ["Hampstead", "Highgate", "Kentish Town", "Primrose Hill", "Belsize Park"],
      "Islington": ["Angel", "Highbury", "Canonbury", "Clerkenwell", "Barnsbury"],
      "Greenwich": ["Blackheath", "Eltham", "Charlton", "Woolwich", "Plumstead"],
      "Hackney": ["Shoreditch", "Hoxton", "Dalston", "Stoke Newington", "Clapton"]
    }
  },
  "UAE": {
    "Dubai": {
      "Downton Dubai": ["Burj Khalifa", "Business Bay", "DIFC", "City Walk", "Al Wasl"],
      "Marina": ["JBR", "JLT", "Bluewaters", "The Greens", "Barsha Heights"],
      "Deira": ["Al Rigga", "Muraqqabat", "Naif", "Hor Al Anz", "Abu Hail"],
      "Bur Dubai": ["Al Karama", "Al Mankhool", "Al Jafiliya", "Oud Metha", "Al Hamriya"],
      "Jumeirah": ["Jumeirah 1", "Jumeirah 2", "Jumeirah 3", "Umm Suqeim", "Al Safa"]
    },
    "Abu Dhabi": {
      "Khalidiya": ["Corniche", "Al Bateen", "Al Mushrif", "Al Nahyan", "Al Rowdah"],
      "Yas Island": ["Yas West", "Yas East", "Yas North", "Yas South", "Yas Gateway"],
      "Saadiyat Island": ["Cultural District", "Beach District", "Marina District", "Resort District", "Eco District"],
      "Reem Island": ["Marina Square", "Shams Abu Dhabi", "City of Lights", "Tamouh", "Najmat"],
      "Al Maryah Island": ["Global Market", "Sowwah Square", "Galleria", "Rosewood", "Four Seasons"]
    },
    "Sharjah": {
      "Al Majaz": ["Majaz 1", "Majaz 2", "Majaz 3", "Buheirah", "Corniche"],
      "Al Nahda": ["Nahda South", "Nahda North", "Industrial Area 7", "Sahara", "Safeer"],
      "Muwaileh": ["University City", "Al Zahia", "Al Jada", "Muwaileh Commercial", "industrial 15"],
      "Mirdif": ["Mirdif West", "Mirdif East", "Uptown", "Mushrif Park", "Shorooq"],
      "Al Khan": ["Khan Village", "Khan Beach", "Maryum Island", "Mamzar", "Khalidiya"]
    },
    "Ajman": {
      "Ajman Downtown": ["Al Nuaimia", "Al Rashidiya", "Al Bustan", "Al Nakheel", "Al Rumailah"],
      "Al Mowaihat": ["Mowaihat 1", "Mowaihat 2", "Mowaihat 3", "Talla", "Shannouf"],
      "Al Rawda": ["Rawda 1", "Rawda 2", "Rawda 3", "Jurf", "Hamidiya"],
      "Al Jurf": ["Jurf 1", "Jurf 2", "Jurf 3", "Ghuwaifat", "Zahra"],
      "Corniche Ajman": ["Beach Front", "Port Area", "Heritage District", "Marina", "Garden City"]
    },
    "RAK": {
      "Al Hamra Village": ["Hamra North", "Hamra South", "Hamra Marina", "Hamra Beach", "Royal Breeze"],
      "Mina Al Arab": ["Bermuda", "Malibu", "Granada", "Flamingo", "Lagoon"],
      "Al Marjan Island": ["Breeze Island", "Treasure Island", "Dream Island", "View Island", "Coral Island"],
      "RAK City": ["Al Nakheel", "Al Mamourah", "Al Juwais", "Al Dhait", "Al Oraibi"],
      "Al Rams": ["Rams Beach", "Rams Harbour", "Rams Hill", "Rams Valley", "Rams Plain"]
    }
  },
  "Australia": {
    "NSW": {
      "Sydney": ["CBD", "Surry Hills", "Paddington", "Newton", "Bondi"],
      "Newcastle": ["Merewether", "Hamilton", "Cooks Hill", "Newcastle East", "The Junction"],
      "Wollongong": ["North Wollongong", "Gwynneville", "Mount Keira", "Figtree", "Keiraville"],
      "Parramatta": ["Harris Park", "North Parramatta", "Westmead", "Rosehill", "Merrylands"],
      "Central Coast": ["Gosford", "Wyong", "Terrigal", "The Entrance", "Woy Woy"]
    },
    "Victoria": {
      "Melbourne": ["CBD", "Fitzroy", "South Yarra", "St Kilda", "Richmond"],
      "Geelong": ["Newtown", "Belmont", "Highton", "Grovedale", "South Geelong"],
      "Ballarat": ["Lake Wendouree", "Mount Clear", "Buninyong", "Sebastopol", "Wendouree"],
      "Bendigo": ["Strathdale", "Epsom", "Kangaroo Flat", "Flora Hill", "Golden Square"],
      "Mildura": ["Nichols Point", "Irymple", "Merbein", "Red Cliffs", "Cullulleraine"]
    },
    "Queensland": {
      "Brisbane": ["Fortitude Valley", "West End", "New Farm", "South Brisbane", "Paddington"],
      "Gold Coast": ["Surfers Paradise", "Broadbeach", "Burleigh Heads", "Coolangatta", "Southport"],
      "Sunshine Coast": ["Noosa Heads", "Maroochydore", "Caloundra", "Mooloolaba", "Coolum"],
      "Townsville": ["North Ward", "Castle Hill", "Belgian Gardens", "Pimlico", "Mundingburra"],
      "Cairns": ["Edge Hill", "Whitfield", "Redlynch", "Freshwater", "Stratford"]
    },
    "Western Australia": {
      "Perth": ["Subiaco", "Leederville", "Fremantle", "Cottesloe", "Mount Lawley"],
      "Mandurah": ["Halls Head", "Falcon", "Meadow Springs", "Silver Sands", "Dudley Park"],
      "Bunbury": ["East Bunbury", "South Bunbury", "College Grove", "Dalyellup", "Pelican Point"],
      "Geraldton": ["Mount Tarcoola", "Beachlands", "Wonthella", "Sunset Beach", "Beresford"],
      "Kalgoorlie": ["South Kalgoorlie", "Lamington", "Piccadilly", "Somerville", "Victory Heights"]
    },
    "South Australia": {
      "Adelaide": ["North Adelaide", "Stepney", "Dulwich", "Unley", "Glenelg"],
      "Mount Gambier": ["Glenburnie", "Suttontown", "Yahl", "Worrolong", "Square Mile"],
      "Whyalla": ["Whyalla Jenkins", "Whyalla Norrie", "Whyalla Playford", "Whyalla Stuart", "Whyalla Barson"],
      "Gawler": ["Gawler East", "Gawler South", "Gawler West", "Willaston", "Hewett"],
      "Murray Bridge": ["Swanport", "Greenbanks", "Northern Heights", "Monarto", "Riverglades"]
    }
  }
};

// Support component for Searchable Select
function SearchableSelect({ 
  value, 
  onValueChange, 
  options, 
  placeholder, 
  icon: Icon,
  disabled = false,
  error = ""
}: { 
  value: string, 
  onValueChange: (val: string) => void, 
  options: string[], 
  placeholder: string,
  icon: any,
  disabled?: boolean,
  error?: string
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative group">
      <div className="relative">
        <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${disabled ? "text-gray-200" : (error ? "text-rose-400" : "text-gray-300 group-focus-within:text-blue-500")}`} size={16} />
        <Input 
          value={open ? search : (value || "")}
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
          className={`h-10 pl-10 pr-10 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-xl transition-all text-[13px] shadow-sm ${disabled ? "bg-gray-50/50 cursor-default opacity-80" : (error ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5")}`} 
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
        {!disabled && <ChevronRight className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 transition-all duration-300 ${open ? "rotate-90" : "rotate-0"}`} size={16} />}
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
            <div className="px-4 py-2 text-[12px] text-gray-400 italic">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

interface ClientFormProps {
  initialData?: any;
  isEdit?: boolean;
  isView?: boolean;
}

import { useCreateVendorClient, useUpdateVendorClient, VendorClient } from "@/hooks/use-vendor-clients";

// ... existing code ...

export function AddClientContent({ initialData, isEdit = false, isView = false }: ClientFormProps) {
  const router = useRouter();
  const [profilePic, setProfilePic] = useState<string | null>(initialData?.profile_pic || null);
  const [showPassword, setShowPassword] = useState(false);
  
  const createMutation = useCreateVendorClient();
  const updateMutation = useUpdateVendorClient();

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    mobile: initialData?.mobile || "",
    email: initialData?.email || "",
    password: "", 
    address: initialData?.address || "",
    country: initialData?.country || "",
    state: initialData?.state || "",
    district: initialData?.district || "",
    city: initialData?.city || "",
    locality: initialData?.locality || "",
    pincode: initialData?.pincode || "",
  });

  const [registrationType, setRegistrationType] = useState<"guest" | "client">(initialData?.registration_type || "client");
  const [selectedPlan, setSelectedPlan] = useState<string>(initialData?.plan || "");
  const [loginAccess, setLoginAccess] = useState<boolean>(Number(initialData?.login_access) === 1 || initialData?.login_access === true);
  const [sendCredentialsToEmail, setSendCredentialsToEmail] = useState<boolean>(Number(initialData?.send_credentials_to_email) === 1 || initialData?.send_credentials_to_email === true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setProfilePic(initialData.profile_pic || null);
      setFormData({
        name: initialData.name || "",
        mobile: initialData.mobile || "",
        email: initialData.email || "",
        password: "", 
        address: initialData.address || "",
        country: initialData.country || "",
        state: initialData.state || "",
        district: initialData.district || "",
        city: initialData.city || "",
        locality: initialData.locality || "",
        pincode: initialData.pincode || "",
      });
      setRegistrationType(initialData.registration_type || "client");
      setSelectedPlan(initialData.plan || "");
      setLoginAccess(Number(initialData.login_access) === 1 || initialData.login_access === true);
      setSendCredentialsToEmail(Number(initialData.send_credentials_to_email) === 1 || initialData.send_credentials_to_email === true);
    }
  }, [initialData]);

  // Dynamic Options derived from Hierarchy
  const countryOptions = useMemo(() => Object.keys(LOCATION_DATA), []);
  
  const stateOptions = useMemo(() => {
    if (!formData.country || !LOCATION_DATA[formData.country]) return [];
    return Object.keys(LOCATION_DATA[formData.country]);
  }, [formData.country]);

  const districtOptions = useMemo(() => {
    if (!formData.country || !formData.state || !LOCATION_DATA[formData.country]?.[formData.state]) return [];
    return Object.keys(LOCATION_DATA[formData.country][formData.state]);
  }, [formData.country, formData.state]);

  const cityOptions = useMemo(() => {
    if (!formData.country || !formData.state || !formData.district || !LOCATION_DATA[formData.country]?.[formData.state]?.[formData.district]) return [];
    return LOCATION_DATA[formData.country][formData.state][formData.district];
  }, [formData.country, formData.state, formData.district]);

  const handleSave = async () => {
    if (isView) return;
    setErrors({}); 

    const newErrors: Record<string, string> = {};

    const requiredFields = [
      { key: 'name', label: 'Full Name' },
      { key: 'mobile', label: 'Mobile Number' },
      { key: 'email', label: 'Email Address' },
      { key: 'address', label: 'Street Address' },
      { key: 'country', label: 'Country' },
      { key: 'state', label: 'State' },
      { key: 'district', label: 'District' },
      { key: 'city', label: 'City' },
      { key: 'locality', label: 'Locality' },
      { key: 'pincode', label: 'Pincode' },
    ];

    requiredFields.forEach(field => {
      if (!formData[field.key as keyof typeof formData]) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    if (!isEdit && !formData.password) {
      newErrors.password = "Password is required";
    }

    if (!profilePic) {
      newErrors.profilePic = "Profile photo is required";
    }

    if (registrationType === "client" && !selectedPlan) {
      newErrors.selectedPlan = "Subscription plan is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the errors in the form.");
      return;
    }

    const submissionData: any = {
      ...formData,
      profile_pic: profilePic,
      registration_type: registrationType,
      plan: registrationType === "guest" ? "not_subscribed" : selectedPlan,
      login_access: loginAccess ? 1 : 0,
      send_credentials_to_email: sendCredentialsToEmail ? 1 : 0,
    };

    if (isEdit) {
      await updateMutation.mutateAsync({ id: initialData.id, data: submissionData });
    } else {
      await createMutation.mutateAsync(submissionData);
    }
    
    router.push("/clients");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isView) return;
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size exceeds 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
            // Professional client-side compression
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 400; // Small but high quality for avatars
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_SIZE) {
                    height *= MAX_SIZE / width;
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width *= MAX_SIZE / height;
                    height = MAX_SIZE;
                }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Save as lightweight JPEG
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
            setProfilePic(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-[calc(100vh-86px)] overflow-y-auto px-4 sm:px-6 lg:px-8 pt-2 pb-10 custom-scrollbar">
      <div className={`space-y-6 max-w-7xl mx-auto ${isView ? "p-2" : ""}`}>
      {/* Header - Only show in Full Page */}
      {!isView && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/clients" className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-100 dark:border-gray-800 text-gray-400 hover:text-blue-500 hover:border-blue-100 transition-all">
                <ArrowLeft size={18} />
              </Link>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight flex items-center gap-2">
                {isEdit ? "Edit Client Profile" : "Add Client"}
                <Badge variant="outline" className={`text-[10px] font-bold ml-1 ${isEdit ? "border-emerald-200 text-emerald-600" : "border-indigo-200 text-indigo-600"}`}>
                  {isEdit ? "UPDATE" : "REGISTRATION"}
                </Badge>
              </h1>
            </div>
            <p className="text-sm text-gray-400 mt-1 italic tracking-tight font-medium leading-relaxed">
              {isEdit 
                ? `You are currently updating the profile details of ${initialData?.name || "the client"}.` 
                : "Enter the client's details to create a new professional profile."}
            </p>
          </div>
        </div>
      )}

      <div className={`flex flex-col lg:flex-row gap-8 ${!isView ? "pb-20" : ""}`}>
        {/* Main Form Area */}
        <div className={`flex-[2] space-y-6`}>
           <CommonCard 
              title="Personal Information" 
              subtitle="Basic details of the client account" 
              icon={User}
              isView={isView}
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                 <FormGroup label="Full Name" icon={User} error={errors.name} required isView={isView}>
                    <Input 
                      value={formData.name}
                      onChange={(e) => {
                        !isView && setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                      }}
                      readOnly={isView}
                      placeholder="Enter full name" 
                      className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl transition-all text-[14px] ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : (errors.name ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5")}`} 
                    />
                 </FormGroup>

                 <FormGroup label="Mobile Number" icon={Phone} error={errors.mobile} required isView={isView}>
                    <Input 
                      value={formData.mobile}
                      onChange={(e) => {
                        !isView && setFormData({ ...formData, mobile: e.target.value });
                        if (errors.mobile) setErrors(prev => ({ ...prev, mobile: "" }));
                      }}
                      readOnly={isView}
                      placeholder="Enter mobile number" 
                      className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl transition-all text-[14px] ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : (errors.mobile ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5")}`} 
                    />
                 </FormGroup>

                 <FormGroup label="Email Address" icon={Mail} error={errors.email} required isView={isView}>
                    <Input 
                      value={formData.email}
                      onChange={(e) => {
                        !isView && setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                      }}
                      readOnly={isView}
                      placeholder="Enter email address" 
                      className={`h-12 pl-12 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl transition-all text-[14px] ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : (errors.email ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5")}`} 
                    />
                 </FormGroup>

                 <FormGroup label="Password" icon={Lock} error={errors.password} required isView={isView}>
                    <Input 
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => {
                        !isView && setFormData({ ...formData, password: e.target.value });
                        if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                      }}
                      readOnly={isView}
                      placeholder="Enter password" 
                      className={`h-12 pl-12 pr-12 border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl transition-all text-[14px] ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : (errors.password ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5")}`} 
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
              </div>
           </CommonCard>

           <CommonCard 
              title="Address Details" 
              subtitle="Physical location and correspondence info" 
              icon={MapPin}
              iconColorClass="text-orange-600"
              iconBgClass="bg-orange-50 dark:bg-orange-500/10"
              isView={isView}
           >
              <div className="space-y-6">
                 <FormGroup label="Street Address" icon={Home} error={errors.address} required isView={isView}>
                    <textarea 
                       value={formData.address}
                       onChange={(e) => {
                         !isView && setFormData({ ...formData, address: e.target.value });
                         if (errors.address) setErrors(prev => ({ ...prev, address: "" }));
                       }}
                       readOnly={isView}
                       placeholder="Enter full address" 
                       className={`w-full pl-12 pr-3 py-3 border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl outline-none transition-all text-[14px] min-h-[100px] resize-none ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : (errors.address ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5")}`} 
                    />
                 </FormGroup>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <FormGroup label="Country" required isView={isView} error={errors.country}>
                       <SearchableSelect 
                          value={formData.country} 
                          onValueChange={(val) => {
                            !isView && setFormData({ ...formData, country: val, state: "", district: "", city: "" });
                            if (errors.country) setErrors(prev => ({ ...prev, country: "" }));
                          }}
                          options={countryOptions}
                          placeholder="Select Country"
                          icon={Flag}
                          disabled={isView}
                          error={errors.country}
                       />
                    </FormGroup>

                    <FormGroup label="State" required isView={isView} error={errors.state}>
                       <SearchableSelect 
                          value={formData.state} 
                          onValueChange={(val) => {
                            !isView && setFormData({ ...formData, state: val, district: "", city: "" });
                            if (errors.state) setErrors(prev => ({ ...prev, state: "" }));
                          }}
                          options={stateOptions}
                          placeholder={formData.country ? "Select State" : "Select Country First"}
                          icon={Globe}
                          disabled={isView || stateOptions.length === 0}
                          error={errors.state}
                       />
                    </FormGroup>

                    <FormGroup label="District" required isView={isView} error={errors.district}>
                       <SearchableSelect 
                          value={formData.district} 
                          onValueChange={(val) => {
                            !isView && setFormData({ ...formData, district: val, city: "" });
                            if (errors.district) setErrors(prev => ({ ...prev, district: "" }));
                          }}
                          options={districtOptions}
                          placeholder={formData.state? "Select District" : "Select State First"}
                          icon={Building}
                          disabled={isView || districtOptions.length === 0}
                          error={errors.district}
                       />
                    </FormGroup>

                    <FormGroup label="City" required isView={isView} error={errors.city}>
                       <SearchableSelect 
                          value={formData.city} 
                          onValueChange={(val) => {
                            !isView && setFormData({ ...formData, city: val });
                            if (errors.city) setErrors(prev => ({ ...prev, city: "" }));
                          }}
                          options={cityOptions}
                          placeholder={formData.district ? "Select City" : "Select District First"}
                          icon={Building}
                          disabled={isView || cityOptions.length === 0}
                          error={errors.city}
                       />
                    </FormGroup>

                    <FormGroup label="Locality" icon={MapPin} error={errors.locality} required isView={isView}>
                       <Input 
                         value={formData.locality}
                         onChange={(e) => {
                           !isView && setFormData({ ...formData, locality: e.target.value });
                           if (errors.locality) setErrors(prev => ({ ...prev, locality: "" }));
                         }}
                         readOnly={isView}
                         placeholder="Enter locality" 
                         className={`h-10 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-xl transition-all text-[13px] shadow-sm ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : (errors.locality ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5")}`} 
                       />
                    </FormGroup>

                    <FormGroup label="Pincode" icon={Hash} error={errors.pincode} required isView={isView}>
                       <Input 
                         value={formData.pincode}
                         onChange={(e) => {
                           !isView && setFormData({ ...formData, pincode: e.target.value });
                           if (errors.pincode) setErrors(prev => ({ ...prev, pincode: "" }));
                         }}
                         readOnly={isView}
                         placeholder="Enter pincode" 
                         className={`h-10 pl-12 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-xl transition-all text-[13px] shadow-sm ${isView ? "focus:ring-0 cursor-default border-transparent bg-transparent pl-8 font-black text-gray-800" : (errors.pincode ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5")}`} 
                       />
                    </FormGroup>
                 </div>
              </div>
           </CommonCard>
        </div>

        {/* Right Column - Sidebar */}
        <div className="flex-1 space-y-8">
           {/* Section 4: Photo Card */}
           <div className="bg-white dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm text-center">
              <div className="relative w-32 h-32 mx-auto mb-6 group cursor-pointer">
                 <div className={`absolute inset-0 rounded-full bg-blue-500/10 ${!isView && "group-hover:bg-blue-500/20"} transition-all duration-300`} />
                 <Avatar className="w-full h-full rounded-full border-4 border-white dark:border-gray-800 shadow-xl transition-transform duration-300 group-hover:scale-[1.02]">
                    <AvatarImage src={profilePic || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-none transition-all">
                       <User size={48} className="text-gray-300" />
                    </AvatarFallback>
                 </Avatar>
                 {!isView && (
                    <label className="absolute bottom-1 right-1 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition-all border-4 border-white dark:border-[#1f2937] active:scale-95 z-20">
                        <Camera size={18} />
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                 )}
              </div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-widest">
                Profile Picture {!isView && <span className="text-red-500 ml-1">*</span>}
              </h3>
              <FormGroup label="" error={errors.profilePic} isView={isView} className="p-0 space-y-0 translate-y--2">
                 <div />
              </FormGroup>
              {!isView && <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-tighter italic font-medium">Max 10MB</p>}
           </div>

           {/* Registration & Plan Card */}
           <div className={`bg-white dark:bg-[#1f2937] space-y-5 ${isView ? "border-none shadow-none p-0" : "rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"}`}>
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Building size={16} />
                 </div>
                 <h3 className="text-[12px] font-bold text-gray-800 dark:text-gray-100 uppercase tracking-widest">
                    Subscription Type {!isView && <span className="text-red-500 ml-1">*</span>}
                 </h3>
              </div>

              {/* Radio Selector */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                 <button 
                   type="button"
                   onClick={() => !isView && setRegistrationType("guest")}
                   className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 ${registrationType === "guest" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 hover:brightness-110 active:scale-95" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"} ${isView ? "cursor-default" : ""}`}
                 >
                    <User size={14} /> Guest
                 </button>
                 <button 
                    type="button"
                    onClick={() => !isView && setRegistrationType("client")}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold transition-all duration-300 ${registrationType === "client" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 hover:brightness-110 active:scale-95" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"} ${isView ? "cursor-default" : ""}`}
                 >
                    <Building size={14} /> Client
                 </button>
              </div>

              {/* Conditional Plan Selection */}
              {registrationType === "client" ? (
                 <FormGroup label="Select Plan" error={errors.selectedPlan} required={!isView} isView={isView} className="animate-in fade-in slide-in-from-top-2 duration-300">
                    {isView ? (
                        <div className="h-10 px-4 flex items-center bg-transparent text-[13px] font-black text-gray-800 border-none shadow-none">
                            {selectedPlan || "No Plan Selected"}
                        </div>
                    ) : (
                        <Select 
                           value={selectedPlan} 
                           onValueChange={(val) => {
                             setSelectedPlan(val as any);
                             if (errors.selectedPlan) setErrors(prev => ({ ...prev, selectedPlan: "" }));
                           }}
                        >
                          <SelectTrigger className={`h-10 w-full border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/20 rounded-xl transition-all text-[13px] shadow-sm ${errors.selectedPlan ? "border-rose-500 ring-4 ring-rose-500/5" : "focus:ring-4 focus:ring-blue-500/5"}`}>
                            <SelectValue placeholder="Select Plan" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                             <SelectItem value="silver" className="text-[13px] rounded-lg cursor-pointer">Silver Plan</SelectItem>
                             <SelectItem value="gold" className="text-[13px] rounded-lg cursor-pointer">Gold Plan</SelectItem>
                             <SelectItem value="platinum" className="text-[13px] rounded-lg cursor-pointer">Platinum Plan</SelectItem>
                          </SelectContent>
                        </Select>
                    )}
                 </FormGroup>
              ) : null}

              {/* Login & Access Fields */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[13px] font-bold text-gray-800 dark:text-gray-200">Login Access</span>
                       <span className="text-[11px] text-gray-400">Allow client to log in to the portal</span>
                    </div>
                    <button 
                       type="button"
                       onClick={() => !isView && setLoginAccess(!loginAccess)}
                       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loginAccess ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                       disabled={isView}
                    >
                       <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${loginAccess ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-[13px] font-bold text-gray-800 dark:text-gray-200">Send Credentials To Email</span>
                       <span className="text-[11px] text-gray-400">Email password automatically</span>
                    </div>
                    <button 
                       type="button"
                       onClick={() => !isView && setSendCredentialsToEmail(!sendCredentialsToEmail)}
                       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${sendCredentialsToEmail ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                       disabled={isView}
                    >
                       <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${sendCredentialsToEmail ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                 </div>
              </div>
           </div>

            {/* Action Buttons - Hide in View Mode */}
            {!isView && (
                 <div className="space-y-4">
                     <ActionFooter 
                        onSave={handleSave} 
                        onCancel={() => router.push("/clients")}
                        saveLabel={isEdit ? "UPDATE CLIENT RECORD" : "SAVE CLIENT RECORD"}
                     />

                     {/* Registration Tip Card */}
                     <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800/50 p-6 shadow-sm border-dashed">
                        <div>
                            <h4 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.1em] mb-1.5 flex items-center gap-2">
                                <Check size={14} className="text-blue-600 dark:text-blue-400" strokeWidth={3} /> Registration Tip
                            </h4>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">
                                Ensure the mobile number is unique. This will be used as the primary identifier for event notifications and login.
                            </p>
                        </div>
                     </div>
                 </div>
            )}
        </div>
      </div>
    </div>
  </div>
);
}
