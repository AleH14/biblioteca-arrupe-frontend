export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light py-2">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <p className="text-dark small mb-0 font-geist-mono opacity-75">
              &copy; {currentYear} Colegio Español Padre Arrupe
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}