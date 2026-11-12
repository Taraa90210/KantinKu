import { menus } from "@/data/menu";
import KatalogMenu from "@/components/KatalogMenu"; 

export default function Katalog() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Menu</h1>
      <KatalogMenu menu={menus}/>
    </div>
  );
}
