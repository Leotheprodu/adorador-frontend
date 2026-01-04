interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader = ({ title, subtitle }: AuthHeaderProps) => {
  return (
    <div className="px-8 pb-6 pt-10 text-center">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
        {subtitle}
      </p>
    </div>
  );
};
