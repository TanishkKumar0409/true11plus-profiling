import Link from "next/link";
import { CgMoveLeft } from "react-icons/cg";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-(--secondary-bg) px-4 text-center">
      {/* Animated or Highlighted 404 Text */}
      <h1 className="text-9xl font-extrabold text-(--main) animate-bounce">
        404
      </h1>

      {/* Main Message */}
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-(--text-color-emphasis) sm:text-4xl">
        Page Not Found
      </h2>

      {/* Subtext */}
      <p className="mt-4 text-lg text-(--text-color) max-w-md mx-auto">
        Oops! It seems like the page you are looking for doesn&apos;t exist or has
        been moved.
      </p>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-(--main) rounded-lg hover:bg-(--main-emphasis) transition-colors duration-200 shadow-md"
        >
          <CgMoveLeft className="mr-2 h-5 w-5" />
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
