import { PageWrapper } from '@global/utils/PageWrapper';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';
export default function NotFound() {
  return (
    <PageWrapper>
      <div className="mt-16 flex h-60 flex-col items-center justify-center">
        <h2 className="mb-8 text-3xl font-bold uppercase">404</h2>
        <p className="mb-8 text-xl text-negro">
          No encontramos el recurso solicitado
        </p>
        <Link
          className="rounded bg-slate-100 p-3 uppercase text-negro"
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
