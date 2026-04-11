"use client";

import { useState } from "react";
import { Edit, Globe, MapPin, Plus, X } from "lucide-react";

const cardClass =
  "bg-card rounded-[5px] border border-border overflow-hidden shadow-sm dark:shadow-none mb-6 ";

export function VendorLocationCard() {
  const [mapUrl, setMapUrl] = useState<string>(
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15774.649406022643!2d77.65316343283229!3d8.723576470830025!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b041155f6b7c95d%3A0x6d92cee22878c849!2sPettai%2C%20Tamil%20Nadu%20627004!5e0!3m2!1sen!2sin!4v1773463883440!5m2!1sen!2sin",
  );
  const [isEditingMap, setIsEditingMap] = useState(false);
  const [tempMapUrl, setTempMapUrl] = useState("");

  const handleSaveMap = () => {
    if (tempMapUrl.includes("iframe") || tempMapUrl.startsWith("http")) {
      const match = tempMapUrl.match(/src="([^"]+)"/);
      const url = match ? match[1] : tempMapUrl;
      setMapUrl(url);
      setIsEditingMap(false);
      setTempMapUrl("");
    }
  };

  return (
    <div className={`${cardClass} p-8`}>
      <div className="flex items-center justify-between mb-6">
        <h6 className="text-foreground text-[15px] font-bold uppercase tracking-wider mb-0">
          Location
        </h6>
        {mapUrl && !isEditingMap && (
          <button
            onClick={() => {
              setIsEditingMap(true);
              setTempMapUrl(mapUrl);
            }}
            className="flex items-center gap-1.5 text-primary text-[12px] font-bold uppercase transition-all hover:opacity-70"
          >
            <Edit size={14} /> Edit
          </button>
        )}
      </div>

      <div className="space-y-4">
        {isEditingMap ? (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-muted/30 p-4 rounded-[5px] border border-border">
              <label className="block text-foreground text-[12px] font-bold mb-2 uppercase tracking-wide">
                Paste Google Maps Embed URL/Iframe
              </label>
              <textarea
                value={tempMapUrl}
                onChange={(e) => setTempMapUrl(e.target.value)}
                placeholder='<iframe src="..." ...></iframe>'
                className="w-full px-3 py-2 bg-card border border-border rounded-[5px] text-[12px] text-muted-foreground focus:outline-none focus:border-primary min-h-[80px] resize-none mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveMap}
                  className="flex-1 py-2 bg-primary text-white text-[11px] font-bold rounded-[3px] uppercase shadow-sm hover:bg-primary/90"
                >
                  Save Location
                </button>
                <button
                  onClick={() => setIsEditingMap(false)}
                  className="px-4 py-2 bg-white hover:bg-rose-600 border-2 border-red-500 text-red-500 hover:text-white transition-all duration-300 rounded-lg text-[11px] font-bold flex items-center justify-center gap-2 active:scale-95 shadow-sm uppercase"
                >
                  <X size={14} strokeWidth={2.5} /> Cancel
                </button>
              </div>
            </div>
          </div>
        ) : mapUrl ? (
          <div className="rounded-[5px] border border-border overflow-hidden bg-gray-50 aspect-video relative shadow-sm group">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        ) : (
          <div className="rounded-[5px] border border-dashed border-border bg-muted/30 aspect-video flex flex-col items-center justify-center text-center p-6 group transition-all hover:bg-primary/10">
            <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground mb-3 group-hover:scale-110 transition-transform">
              <MapPin size={24} />
            </div>
            <p className="text-foreground text-[13px] font-bold mb-1">
              No Location Added
            </p>
            <p className="text-muted-foreground text-[11px] mb-4">
              Add your venue or office location for clients to find you easily.
            </p>
            <button
              onClick={() => setIsEditingMap(true)}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-primary text-primary text-[11px] font-bold rounded-[3px] uppercase hover:bg-primary hover:text-white transition-all"
            >
              <Plus size={14} /> Add Location
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 text-primary text-[12px] font-medium hover:underline cursor-pointer group">
          <Globe
            size={14}
            className="group-hover:rotate-12 transition-transform"
          />
          View on Google Maps
        </div>
      </div>
    </div>
  );
}
