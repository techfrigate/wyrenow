import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Country } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Toggle } from "../ui/Toggle";
import { createCountry, updateCountry } from "../../store/slices/countrySlice";
import { apiClient } from "../../utils/api";

const GEONAMES_USERNAME = "dhruvswami";
const GEONAMES_BASE_URL = "https://secure.geonames.org";

const CURRENCY_MAP: Record<
  string,
  {
    currency: string;
    symbol: string;
    productPvRate: number;
    bonusPvRate: number;
    platformMargin: number;
  }
> = {
  NG: {
    currency: "Nigerian Naira",
    symbol: "₦",
    productPvRate: 1200,
    bonusPvRate: 525,
    platformMargin: 2000,
  },
  GH: {
    currency: "Ghanaian Cedi",
    symbol: "GH₵",
    productPvRate: 30,
    bonusPvRate: 12,
    platformMargin: 20,
  },
  KE: {
    currency: "Kenyan Shilling",
    symbol: "KSh",
    productPvRate: 150,
    bonusPvRate: 75,
    platformMargin: 200,
  },
  ZA: {
    currency: "South African Rand",
    symbol: "R",
    productPvRate: 18,
    bonusPvRate: 9,
    platformMargin: 25,
  },
  EG: {
    currency: "Egyptian Pound",
    symbol: "E£",
    productPvRate: 31,
    bonusPvRate: 15,
    platformMargin: 40,
  },
  MA: {
    currency: "Moroccan Dirham",
    symbol: "MAD",
    productPvRate: 10,
    bonusPvRate: 5,
    platformMargin: 15,
  },
  UG: {
    currency: "Ugandan Shilling",
    symbol: "USh",
    productPvRate: 3700,
    bonusPvRate: 1800,
    platformMargin: 5000,
  },
  TZ: {
    currency: "Tanzanian Shilling",
    symbol: "TSh",
    productPvRate: 2500,
    bonusPvRate: 1200,
    platformMargin: 3500,
  },
  US: {
    currency: "US Dollar",
    symbol: "$",
    productPvRate: 1,
    bonusPvRate: 0.5,
    platformMargin: 1.5,
  },
  GB: {
    currency: "British Pound",
    symbol: "£",
    productPvRate: 0.8,
    bonusPvRate: 0.4,
    platformMargin: 1.2,
  },
  CA: {
    currency: "Canadian Dollar",
    symbol: "C$",
    productPvRate: 1.35,
    bonusPvRate: 0.7,
    platformMargin: 2,
  },
  AU: {
    currency: "Australian Dollar",
    symbol: "A$",
    productPvRate: 1.5,
    bonusPvRate: 0.75,
    platformMargin: 2.2,
  },
  IN: {
    currency: "Indian Rupee",
    symbol: "₹",
    productPvRate: 83,
    bonusPvRate: 40,
    platformMargin: 120,
  },
  BR: {
    currency: "Brazilian Real",
    symbol: "R$",
    productPvRate: 5,
    bonusPvRate: 2.5,
    platformMargin: 7,
  },
  MX: {
    currency: "Mexican Peso",
    symbol: "$",
    productPvRate: 17,
    bonusPvRate: 8,
    platformMargin: 25,
  },
  CN: {
    currency: "Chinese Yuan",
    symbol: "¥",
    productPvRate: 7,
    bonusPvRate: 3.5,
    platformMargin: 10,
  },
  JP: {
    currency: "Japanese Yen",
    symbol: "¥",
    productPvRate: 150,
    bonusPvRate: 75,
    platformMargin: 220,
  },
};

const FALLBACK_COUNTRIES = [
  { countryCode: "NG", countryName: "Nigeria", geonameId: 2328926 },
  { countryCode: "GH", countryName: "Ghana", geonameId: 2300660 },
  { countryCode: "KE", countryName: "Kenya", geonameId: 192950 },
  { countryCode: "ZA", countryName: "South Africa", geonameId: 953987 },
  { countryCode: "EG", countryName: "Egypt", geonameId: 357994 },
  { countryCode: "MA", countryName: "Morocco", geonameId: 2542007 },
  { countryCode: "UG", countryName: "Uganda", geonameId: 226074 },
  { countryCode: "TZ", countryName: "Tanzania", geonameId: 149590 },
  { countryCode: "US", countryName: "United States", geonameId: 6252001 },
  { countryCode: "GB", countryName: "United Kingdom", geonameId: 2635167 },
  { countryCode: "CA", countryName: "Canada", geonameId: 6251999 },
  { countryCode: "AU", countryName: "Australia", geonameId: 2077456 },
  { countryCode: "IN", countryName: "India", geonameId: 1269750 },
  { countryCode: "BR", countryName: "Brazil", geonameId: 3469034 },
  { countryCode: "MX", countryName: "Mexico", geonameId: 3996063 },
  { countryCode: "CN", countryName: "China", geonameId: 1814991 },
  { countryCode: "JP", countryName: "Japan", geonameId: 1861060 },
];

interface CountryFormProps {
  initialData?: Country | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

interface GeoNamesCountry {
  geonameId: number;
  countryName: string;
  countryCode: string;
  isoAlpha3?: string;
  currencyCode?: string;
}

interface GeoNamesRegion {
  geonameId: number;
  name: string;
  adminCode1?: string;
  fcode: string;
  countryCode: string;
}

export function CountryForm({
  initialData,
  onSubmit,
  onCancel,
}: CountryFormProps) {
  const dispatch = useDispatch();

  const isUpdateMode = Boolean(initialData);
  const [showRegionSelection] = useState(isUpdateMode);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    currency: "",
    currencySymbol: "",
    productPvRate: 1200,
    bonusPvRate: 525,
    platformMargin: 2000,
    crossCountryCapPercentage: 30,
    status: "active",
  });

  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [availableRegions, setAvailableRegions] = useState<GeoNamesRegion[]>(
    []
  );
  const [countries, setCountries] = useState<GeoNamesCountry[]>([]);
  const [existingCountries, setExistingCountries] = useState<Country[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [apiStatus, setApiStatus] = useState<string>("");

  const makeGeoNamesRequest = async (
    endpoint: string,
    params: Record<string, string> = {}
  ) => {
    const url = new URL(`${GEONAMES_BASE_URL}/${endpoint}`);
    url.searchParams.append("username", GEONAMES_USERNAME);
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));

    try {
      const res = await fetch(url.toString(), {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.status) throw new Error(`GeoNames: ${data.status.message}`);
      return data;
    } catch (err) {
      console.error("GeoNames error", err);
      throw err;
    }
  };

  const getCountryGeonameId = (code: string) =>
    countries.find((c) => c.countryCode === code)?.geonameId ?? 0;

  const generateRegionCode = (name: string, adminCode?: string) => {
    if (adminCode && adminCode.length <= 3) return adminCode.toUpperCase();
    const words = name.split(" ");
    return (
      words.length > 1 ? words.map((w) => w[0]).join("") : name.substring(0, 3)
    ).toUpperCase();
  };

  const handleRegionToggle = (region: string) =>
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  const selectAllRegions = () =>
    setSelectedRegions(availableRegions.map((r) => r.name));
  const deselectAllRegions = () => setSelectedRegions([]);

  useEffect(() => {
    (async () => {
      try {
        const existing = await apiClient.getCountries();
        setExistingCountries(existing);
      } catch (err) {
        console.error("API countries error", err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoadingCountries(true);
        setApiStatus("Loading countries…");
        const data = await makeGeoNamesRequest("countryInfoJSON");
        const list = data.geonames?.length ? data.geonames : FALLBACK_COUNTRIES;
        setCountries(
          list.sort((a: GeoNamesCountry, b: GeoNamesCountry) =>
            a.countryName.localeCompare(b.countryName)
          )
        );
        setApiStatus("Countries ready");
      } catch (_) {
        setCountries(
          FALLBACK_COUNTRIES.sort((a, b) =>
            a.countryName.localeCompare(b.countryName)
          )
        );
        setApiStatus("GeoNames failed → using offline list");
      } finally {
        setLoadingCountries(false);
      }
    })();
  }, []);

  const fetchRegions = async (code: string) => {
    try {
      setLoadingRegions(true);
      const id = getCountryGeonameId(code);
      if (!id) throw new Error("No geonameId for country");
      const data = await makeGeoNamesRequest("childrenJSON", {
        geonameId: id.toString(),
      });
      const regions = (data.geonames || []).filter(
        (r: GeoNamesRegion) => r.fcode === "ADM1" || r.fcode === "ADMD"
      );
      setAvailableRegions(regions);
      setSelectedRegions(regions.map((r) => r.name));
    } catch (err) {
      console.error("regions error", err);
      setAvailableRegions([]);
      setSelectedRegions([]);
    } finally {
      setLoadingRegions(false);
    }
  };

  useEffect(() => {
    if (!initialData) return;
    setFormData({
      name: initialData.name,
      code: initialData.code,
      currency: initialData.currency,
      currencySymbol: initialData.currencySymbol,
      productPvRate: initialData.productPvRate,
      bonusPvRate: initialData.bonusPvRate,
      platformMargin: initialData.platformMargin,
      crossCountryCapPercentage: initialData.crossCountryCapPercentage,
      status: initialData.status,
    });
    setSelectedRegions(initialData.regions?.map((r) => r.name) || []);
    fetchRegions(initialData.code);
  }, [initialData, countries]);

  const handleCountrySelect = async (code: string) => {
    const c = countries.find((cty) => cty.countryCode === code);
    if (!c) return;
    const curInfo = CURRENCY_MAP[code] || {
      currency: c.currencyCode || "Local Currency",
      symbol: c.currencyCode || "$",
      productPvRate: 1200,
      bonusPvRate: 525,
      platformMargin: 2000,
    };
    setFormData((prev) => ({
      ...prev,
      name: c.countryName,
      code: c.countryCode,
      currency: curInfo.currency,
      currencySymbol: curInfo.symbol,
      productPvRate: curInfo.productPvRate,
      bonusPvRate: curInfo.bonusPvRate,
      platformMargin: curInfo.platformMargin,
    }));
    setSelectedRegions([]);
    await fetchRegions(code);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    const {
      name,
      code,
      currency,
      currencySymbol,
      productPvRate,
      bonusPvRate,
      platformMargin,
      crossCountryCapPercentage,
    } = formData;

    if (!name.trim()) e.name = "Country name is required";
    if (!code.trim()) e.code = "Country code is required";
    else if (code.length < 2 || code.length > 3)
      e.code = "Code must be 2–3 characters";
    else if (
      !initialData &&
      existingCountries.some((c) => c.code === code.toUpperCase())
    )
      e.code = `Code \"${code}\" already exists`;
    if (!currency.trim()) e.currency = "Currency name is required";
    if (!currencySymbol.trim())
      e.currencySymbol = "Currency symbol is required";
    if (productPvRate <= 0) e.productPvRate = "Must be > 0";
    if (bonusPvRate <= 0) e.bonusPvRate = "Must be > 0";
    if (platformMargin <= 0) e.platformMargin = "Must be > 0";
    if (crossCountryCapPercentage <= 0 || crossCountryCapPercentage > 100)
      e.crossCountryCapPercentage = "Must be 1–100";

    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const regionsPayload = selectedRegions.map((name) => {
        const r = availableRegions.find((ar) => ar.name === name);
        return {
          name,
          code: generateRegionCode(name, r?.adminCode1),
          geonameId: r?.geonameId,
          status: "active",
        };
      });

      if (isUpdateMode && initialData) {
        const updateData: Partial<Country> = {
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          currency: formData.currency.trim(),
          currencySymbol: formData.currencySymbol.trim(),
          productPvRate: Number(formData.productPvRate),
          bonusPvRate: Number(formData.bonusPvRate),
          platformMargin: Number(formData.platformMargin),
          crossCountryCapPercentage: Number(formData.crossCountryCapPercentage),
          status: formData.status || "active",
          regions: regionsPayload, // ← now included
        };

        const res = await dispatch(
          updateCountry({ id: initialData.id, data: updateData })
        );
        if (updateCountry.fulfilled.match(res)) {
          onSubmit(res.payload);
        } else {
          throw new Error((res.payload as string) || "Update failed");
        }
      } else {
        const payload = {
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
          currency: formData.currency.trim(),
          currency_symbol: formData.currencySymbol.trim(),
          product_pv_rate: Number(formData.productPvRate),
          bonus_pv_rate: Number(formData.bonusPvRate),
          platform_margin: Number(formData.platformMargin),
          cross_country_cap_percentage: Number(
            formData.crossCountryCapPercentage
          ),
          status: formData.status || "active",
          regions: regionsPayload,
        };

        const res = await dispatch(createCountry(payload));
        if (createCountry.fulfilled.match(res)) {
          onSubmit(res.payload);
          onCancel();
        } else {
          throw new Error((res.payload as string) || "Create failed");
        }
      }
    } catch (err) {
      console.error("submit error", err);
      setErrors((prev) => ({
        ...prev,
        submit: err instanceof Error ? err.message : "Save failed",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="country-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Country *
            </label>
            <select
              id="country-select"
              value={formData.code}
              onChange={(e) => handleCountrySelect(e.target.value)}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-300" : "border-gray-300"
              } ${loadingCountries ? "opacity-50" : ""}`}
              required
              disabled={loadingCountries || !!initialData}
            >
              <option value="">
                {loadingCountries ? "Loading…" : "Select a country"}
              </option>
              {countries.map((c) => (
                <option key={c.countryCode} value={c.countryCode}>
                  {c.countryName} ({c.countryCode})
                </option>
              ))}
            </select>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <Input
            label="Country Code (ISO)"
            value={formData.code}
            onChange={(e) =>
              handleInputChange("code", e.target.value.toUpperCase())
            }
            error={errors.code}
            required
            placeholder="e.g., NG, GH, US"
            maxLength={3}
            disabled={!!initialData}
          />

          <Input
            label="Currency Name"
            value={formData.currency}
            onChange={(e) => handleInputChange("currency", e.target.value)}
            error={errors.currency}
            required
          />
          <Input
            label="Currency Symbol"
            value={formData.currencySymbol}
            onChange={(e) =>
              handleInputChange("currencySymbol", e.target.value)
            }
            error={errors.currencySymbol}
            required
          />
          <Input
            label="Product PV Rate"
            type="number"
            value={formData.productPvRate}
            onChange={(e) =>
              handleInputChange(
                "productPvRate",
                parseFloat(e.target.value) || 0
              )
            }
            error={errors.productPvRate}
            required
            step="0.01"
            min="0.01"
            helperText="Local currency per PV"
          />
          <Input
            label="Bonus PV Rate"
            type="number"
            value={formData.bonusPvRate}
            onChange={(e) =>
              handleInputChange("bonusPvRate", parseFloat(e.target.value) || 0)
            }
            error={errors.bonusPvRate}
            required
            step="0.01"
            min="0.01"
            helperText="Local currency per PV"
          />
          <Input
            label="Platform Margin"
            type="number"
            value={formData.platformMargin}
            onChange={(e) =>
              handleInputChange(
                "platformMargin",
                parseFloat(e.target.value) || 0
              )
            }
            error={errors.platformMargin}
            required
            step="0.01"
            min="0.01"
          />
          <Input
            label="Cross‑Country Cap (%)"
            type="number"
            value={formData.crossCountryCapPercentage}
            onChange={(e) =>
              handleInputChange(
                "crossCountryCapPercentage",
                parseFloat(e.target.value) || 0
              )
            }
            error={errors.crossCountryCapPercentage}
            required
            step="0.01"
            min="0.01"
            max="100"
          />

          <div className="md:col-span-2">
            <Toggle
              label="Country is active"
              checked={formData.status === "active"}
              onChange={(chk) =>
                handleInputChange("status", chk ? "active" : "inactive")
              }
            />
          </div>
        </div>

        {!isUpdateMode && formData.code && (
          <div className="border-t pt-4">
            <p className="text-sm text-gray-500">
              {loadingRegions
                ? "Loading regions…"
                : selectedRegions.length
                ? `${selectedRegions.length} regions auto‑selected for ${formData.name}`
                : "No regions found for this country"}
            </p>
            {errors.regions && (
              <p className="text-sm text-red-600 mt-1">{errors.regions}</p>
            )}
          </div>
        )}

        {isUpdateMode && showRegionSelection && (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  Select Regions/States
                </h4>
                <p className="text-sm text-gray-500">
                  Choose the regions/states for {formData.name} (
                  {selectedRegions.length} selected)
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={selectAllRegions}
                >
                  Select All
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={deselectAllRegions}
                >
                  Clear All
                </Button>
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableRegions.map((r) => (
                  <label
                    key={r.geonameId}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRegions.includes(r.name)}
                      onChange={() => handleRegionToggle(r.name)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{r.name}</span>
                    <span className="text-xs text-gray-400">
                      ({generateRegionCode(r.name, r.adminCode1)})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || loadingCountries}>
            {isSubmitting
              ? "Saving…"
              : isUpdateMode
              ? "Update Country"
              : "Create Country"}
          </Button>
        </div>
      </form>
    </div>
  );
}
