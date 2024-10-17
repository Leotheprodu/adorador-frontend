import { PageWrapper } from "@/global/utils/PageWrapper";
import { Link } from "@nextui-org/link";
import NextLink from "next/link";
export default function NotFound() {
  return (
    <PageWrapper>
      <div className="flex flex-col justify-center items-center h-60 mt-16">
        <h2 className="uppercase mb-8 text-3xl font-bold">404</h2>
        <p className="text-negro mb-8 text-xl">
          No encontramos el recurso solicitado
        </p>
        <Link
          className=" text-negro p-3 uppercase rounded bg-slate-100"
          href="/"
          as={NextLink}
          underline="hover"
        >
          Volver a Inicio
        </Link>
      </div>
    </PageWrapper>
  );
}
