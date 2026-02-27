import { StatCard, SectionHeader } from "../../components/ui";
import type { ApiFetchResult, VehicleSpecs } from "../../lib/type";

export function SpecsSection({
  result,
}: {
  result: ApiFetchResult<VehicleSpecs>;
}) {
  const specs = result.data;

  return (
    <div>
      <SectionHeader
        title="Vehicle Specs"
        subtitle="Engine, performance, and technical specifications"
        badge="API Ninjas"
      />
      {result.status !== "ok" && (
        <div className="mb-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 font-mono text-xs text-yellow-400">
          ⚠ Specs data unavailable ({result.status}) — showing fallback values
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* <StatCard label="Engine" value={specs?.engine} /> */}
        <StatCard label="Cylinders" value={specs?.cylinders} />
        <StatCard label="Displacement" value={specs?.displacement} unit="L" />
        {/* <StatCard label="Horsepower" value={specs?.horsepower} unit="hp" /> */}
        {/* <StatCard label="Torque" value={specs?.torque} unit="lb-ft" /> */}
        <StatCard label="Transmission" value={specs?.transmission} />
        <StatCard label="Drive" value={specs?.drive} />
        <StatCard label="Fuel Type" value={specs?.fuel_type} />
        <StatCard label="City MPG" value={specs?.mpg_city} unit="mpg" />
        <StatCard label="Hwy MPG" value={specs?.mpg_highway} unit="mpg" />
        {/* <StatCard label="Doors" value={specs?.doors} /> */}
        <StatCard label="Body Style" value={specs?.body_style} />
      </div>
    </div>
  );
}