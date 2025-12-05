function Header() {
  return (
    <header className="h-[60px] border-b border-border-primary flex items-center">
      {/* Site Name Section */}
      <div className="bg-bg-secondary w-[450px] h-full flex items-center pl-[38px] border-r border-border-primary">
        <div className="flex items-center gap-[18px]">
          {/* Logo */}
          <img 
            src="/STABIOlogo.png" 
            alt="STABIO Logo" 
            className="h-23px w-20px"
          />
          
          {/* Site Name */}
          <h1 className="text-xl font-extrabold tracking-[0.1em] text-text-primary">
            STABIO
          </h1>
        </div>
      </div>

      {/* Header Right Section (currently empty) */}
      <div className="flex-1"></div>
    </header>
  );
}

export default Header;

