import { redirect } from "next/navigation";

function LangPage() {
  redirect("/store");
  return <div>LangPage</div>;
}

export default LangPage;
