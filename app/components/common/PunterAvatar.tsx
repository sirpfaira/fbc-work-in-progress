import Image from "next/image";
import avatar from "@/app/components/common/avatar.png";

interface PunterAvatarProps {
  image: string | null;
  size: number;
  rating: number;
}

const PunterAvatar = ({ image, rating, size }: Readonly<PunterAvatarProps>) => {
  return (
    <Image
      className={`rounded-full ring-2 p-1 ${
        rating > 66
          ? "ring-rating-top"
          : rating > 33
          ? "ring-rating-middle"
          : "ring-rating-bottom"
      }`}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: `${size}px`, height: `${size}px`, objectFit: "cover" }}
      src={image || avatar}
      alt="User photo"
    />
  );
};

export default PunterAvatar;
