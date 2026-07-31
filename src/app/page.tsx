import { cookies } from "next/headers";
import { OpenLayerComponent } from "../features/openlayer";
import { createClient } from "@/src/utils/supabase/server";
import { CommercialArea } from "../types";

export default async function Home() {
  return (
      <OpenLayerComponent></OpenLayerComponent>
  );
}
