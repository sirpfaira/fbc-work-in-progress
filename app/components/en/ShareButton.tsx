import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AtSign, Copy, MessageCircle, Share2 } from "lucide-react";
import IconWrapper from "@/app/components/common/IconWrapper";
import Link from "next/link";

interface ShareSelectionProps {
  link: string;
}

const ShareSelectionButton = ({ link }: Readonly<ShareSelectionProps>) => {
  return (
    <div className="flex items-center">
      <Dialog>
        <DialogTrigger className="focus:outline-none rounded-lg text-muted-foreground hover:text-primary flex items-center space-x-1">
          <Share2 size={15} />
          <span className="text-small">Share</span>
        </DialogTrigger>
        <DialogContent className="max-w-[350px] bg-card">
          <DialogHeader>
            <DialogTitle className="px-4">Share Selection</DialogTitle>
            <DialogDescription className="flex flex-col text-standard">
              <hr className="mt-1 mb-2 bg-border" />
              <div className="flex flex-col max-h-[60vh] overflow-y-auto space-y-2">
                <button className="flex items-center space-x-2 group menu-item">
                  <IconWrapper>
                    <AtSign size={18} />
                  </IconWrapper>
                  <span>Tag A Follower</span>
                </button>
                <button className="flex items-center space-x-2 group menu-item">
                  <IconWrapper>
                    <Copy size={18} />
                  </IconWrapper>
                  <span>Copy To Clipboard</span>
                </button>
                <Link
                  href={`wa.me/?message=${link}`}
                  target="_blank"
                  className="flex items-center space-x-2 group menu-item"
                >
                  <IconWrapper>
                    <MessageCircle size={18} />
                  </IconWrapper>
                  <span>WhatsApp</span>
                </Link>
                {/*
                <Link
                  href={"/account"}
                  target="_blank"
                  className="flex items-center space-x-2 group menu-item"
                >
                  <IconWrapper>{getIcon(Icons.FACEBOOK, 16)}</IconWrapper>
                  <span>Facebook</span>
                </Link>
                <Link
                  href={"/account"}
                  target="_blank"
                  className="flex items-center space-x-2 group menu-item"
                >
                  <IconWrapper>{getIcon(Icons.TELEGRAM, 18)}</IconWrapper>
                  <span>Telegram</span>
                </Link>
                <Link
                  href={"/account"}
                  target="_blank"
                  className="flex items-center space-x-2 group menu-item"
                >
                  <IconWrapper>{getIcon(Icons.X, 16)}</IconWrapper>
                  <span>X</span>
                </Link>
                <Link
                  href={"/account"}
                  target="_blank"
                  className="flex items-center space-x-2 group menu-item"
                >
                  <IconWrapper>{getIcon(Icons.INSTAGRAM, 16)}</IconWrapper>
                  <span>Instagram</span>
                </Link>
                <Link
                  href={"/account"}
                  target="_blank"
                  className="flex items-center space-x-2 group menu-item"
                >
                  <IconWrapper>{getIcon(Icons.TIKTOK, 16)}</IconWrapper>
                  <span>Tiktok</span>
                </Link> */}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShareSelectionButton;
