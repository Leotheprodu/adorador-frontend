import Link from 'next/link';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';

export const LoginNavButton = ({ pathName }: { pathName: string }) => {
  const user = useStore($user);
  const href = '/auth/login';
  return (
    <li>
      <Link
        href={href}
        className={`linkNav relative text-primario md:text-secundario ${
          pathName.includes(href) &&
          'border-b-2 border-secundario md:border-primario dark:border-primario md:dark:border-secundario'
        }`}
      >
        {user.isLoggedIn ? 'Logout' : 'Login'}
        {!pathName.includes(href) && (
          <span className="absolute bottom-5 left-0 h-0 w-0 border-t-2 border-secundario opacity-0 transition-all duration-100 md:border-primario dark:border-primario md:dark:border-secundario" />
        )}
      </Link>
    </li>
  );
};
