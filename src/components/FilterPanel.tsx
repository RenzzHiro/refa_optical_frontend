import type { Dispatch, SetStateAction } from "react";
import Icon from "./Icon";
export interface FilterState {
  gender: string;
  faceType: string;
  frame: string;
  category: string;
  maxPrice: number;
}
export const initialFilters: FilterState = {
  gender: "",
  faceType: "",
  frame: "",
  category: "",
  maxPrice: 500000,
};
const genders = ["Pria", "Wanita", "Unisex"],
  faces = ["Bulat", "Kotak", "Oval", "Hati", "Oblong"],
  frames = ["Bulat", "Kotak", "Cat eye", "Aviator", "Rectangle"];
export default function FilterPanel({
  filters,
  setFilters,
  onClose,
}: {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  onClose?: () => void;
}) {
  const update = (key: keyof FilterState, value: string | number) =>
    setFilters((c) => ({
      ...c,
      [key]: c[key] === value && key !== "maxPrice" ? "" : value,
    }));
  const count = Object.entries(filters).filter(([k, v]) =>
    k === "maxPrice" ? v < 500000 : !!v,
  ).length;
  return (
    <div className="filter-panel">
      <div className="filter-head">
        <strong>Filter</strong>
        {onClose && (
          <button
            className="icon-button"
            aria-label="Tutup filter"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        )}
      </div>
      <label className="filter-label" htmlFor="filter-max-price">
        Rentang harga
      </label>
      <input
        id="filter-max-price"
        className="price-range"
        type="range"
        min="100000"
        max="500000"
        step="10000"
        value={filters.maxPrice}
        onChange={(e) => update("maxPrice", Number(e.target.value))}
      />
      <div className="price-values">
        <span>Rp 100 ribu</span>
        <span>
          {filters.maxPrice >= 500000
            ? "Rp 500 ribu+"
            : `Maks. Rp ${Math.round(filters.maxPrice / 1000)} ribu`}
        </span>
      </div>
      <fieldset className="filter-group">
        <legend>Gender</legend>
        <div className="filter-chips">
          {genders.map((g) => (
            <button
              key={g}
              type="button"
              className={`filter-chip ${filters.gender === g ? "selected" : ""}`}
              aria-pressed={filters.gender === g}
              onClick={() => update("gender", g)}
            >
              {g}
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="filter-group">
        <legend>Tipe wajah</legend>
        <div className="face-options">
          {faces.map((f, i) => (
            <button
              key={f}
              type="button"
              className={`face-option ${filters.faceType === f ? "selected" : ""}`}
              aria-pressed={filters.faceType === f}
              onClick={() => update("faceType", f)}
            >
              <span className={`face-outline face-${i}`} />
              <span>{f}</span>
            </button>
          ))}
        </div>
      </fieldset>
      <fieldset className="filter-group">
        <legend>Bentuk frame</legend>
        <div className="filter-checks">
          {frames.map((f) => (
            <label key={f} className="check-row">
              <input
                type="checkbox"
                checked={filters.frame === f}
                onChange={() => update("frame", f)}
              />
              <span>{f}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="filter-group">
        <legend>Kategori</legend>
        <div className="filter-checks">
          {[
            ["minus", "Kacamata minus"],
            ["fashion", "Fashion"],
          ].map(([v, l]) => (
            <label key={v} className="check-row">
              <input
                type="checkbox"
                checked={filters.category === v}
                onChange={() => update("category", v)}
              />
              <span>{l}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {onClose && (
        <div className="filter-mobile-actions">
          <button className="button button-primary" onClick={onClose}>
            Tampilkan hasil {count ? `(${count} filter)` : ""}
          </button>
          <button
            className="button button-plain"
            onClick={() => setFilters(initialFilters)}
          >
            Reset filter
          </button>
        </div>
      )}
    </div>
  );
}
