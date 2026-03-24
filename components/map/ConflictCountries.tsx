"use client";

import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import type { Feature, Geometry } from "geojson";
import type { PathOptions } from "leaflet";

export default function ConflictCountries({
  selectedId,
  show,
}: {
  selectedId: string | null;
  show: boolean;
}) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/data/countries.json")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data || !show || !selectedId) return null;

  const style = (
    feature: Feature<Geometry, any> | undefined
  ): PathOptions => {
    const name =
      feature?.properties?.NAME ||
      feature?.properties?.ADMIN;

    if (selectedId === "ukraine") {
      if (name === "Ukraine")
        return { color: "#0057B7", fillOpacity: 0.15, weight: 1 };
      if (name === "Russia")
        return { color: "#FF5555", fillOpacity: 0.15, weight: 1 };
    }

    if (selectedId === "israel-iran") {
      if (name === "Israel")
        return { color: "#0057B7", fillOpacity: 0.15, weight: 1 };
      if (name === "Iran")
        return { color: "#39FF14", fillOpacity: 0.15, weight: 1 };
    }

    return { opacity: 0, fillOpacity: 0 };
  };

  return <GeoJSON data={data} style={style} />;
}
