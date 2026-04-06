import FloorColumn from "./FloorColumn";
import CreateFloorDialog from "./CreateFloorDialog";
import { FloorType } from "@/server/validators/floor.validator";

export default function FloorList({ floors }: { floors: FloorType[] }) {
  return (
    <div className="space-y-12 border w-full gap-12">
      {floors.map((floor) => (
        <FloorColumn key={floor.id} floor={floor} />
      ))}
      <CreateFloorDialog />
    </div>
  );
}
