export default function SocialButtons() {
    return (
      <div className="flex justify-center gap-4">
        <a href="#" className="bg-green-500 p-3 rounded-full hover:bg-orange-500 transition">
          <i className="fab fa-instagram text-xl"></i>
        </a>
        <a href="#" className="bg-green-500 p-3 rounded-full hover:bg-orange-500 transition">
          <i className="fab fa-linkedin text-xl"></i>
        </a>
        <a href="#" className="bg-green-500 p-3 rounded-full hover:bg-orange-500 transition">
          <i className="fab fa-twitter text-xl"></i>
        </a>
      </div>
    );
  }
  