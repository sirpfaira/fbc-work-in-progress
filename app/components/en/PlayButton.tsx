"use client";
import { useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import IconWrapper from "@/app/components/common/IconWrapper";
import { session } from "@/lib/constants";
import { ChevronDown, LayoutList, SquarePen, Import } from "lucide-react";

const PlayButton = ({ uids }: { uids: string[] }) => {
  const { toast } = useToast();
  const [newList, setNewList] = useState("");
  const { singles, lists } = session?.user?.play;

  const containsAll = uids.every(function (val: string) {
    return singles.indexOf(val) >= 0;
  });

  const classes = containsAll
    ? "text-primary hover:text-muted-foreground"
    : "text-muted-foreground hover:text-primary";

  function handleNewList() {
    if (lists.length >= 13) {
      toast({
        title: "List limit reached!",
        description: "Please upgrade your account to add more lists!",
        action: (
          <ToastAction altText="Try again">
            <Link
              href={"/en/account/upgrade"}
              className={`text-primary font-medium`}
            >
              Upgrade
            </Link>
          </ToastAction>
        ),
      });
    } else {
      const listTitle = newList?.trim()?.replace(" ", "-")?.toLowerCase();
      createAndAddToList(listTitle, uids);
    }
  }

  function createAndAddToList(listTitle: string, uids: string[]) {
    toast({
      title: "List limit reached!",
      description: `${listTitle}-${uids.length}`,
    });
  }

  function addToPlayground(uids: string[]) {
    toast({
      title: "List limit reached!",
      description: `${uids.length}`,
    });
  }

  function addToList(listTitle: string, uids: string[]) {
    toast({
      title: "List limit reached!",
      description: `${listTitle}-${uids.length}`,
    });
  }

  return (
    <Dialog>
      <DialogTrigger className="focus:outline-none">
        <div
          className={`flex items-center space-x-1              
            ${classes}`}
        >
          <Import size={18} /> <span className="text-small">Save</span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[350px] bg-card">
        <DialogHeader>
          <DialogTitle>Add To List</DialogTitle>
          <DialogDescription className="flex flex-col text-standard">
            <hr className="mt-1 mb-2 bg-border" />
            <div className="flex flex-col">
              <DialogClose asChild>
                <button
                  onClick={() => {
                    addToPlayground(uids);
                  }}
                  className="flex space-x-2 items-center justify-start py-1"
                >
                  <IconWrapper>
                    <Import size={15} />{" "}
                  </IconWrapper>
                  <span className="px-1">Playground</span>
                </button>
              </DialogClose>
              <div className="flex flex-col">
                {lists?.map((list) => (
                  <DialogClose asChild key={list._id}>
                    <button
                      onClick={() => addToList(list._id, uids)}
                      className="flex justify-start space-x-2 items-center py-1"
                    >
                      <IconWrapper>
                        <LayoutList size={18} />
                      </IconWrapper>
                      <span className="px-1">{list.title}</span>
                    </button>
                  </DialogClose>
                ))}
              </div>
              <details className="group">
                <summary className="flex items-center justify-between font-medium cursor-pointer list-none focus:outline-none">
                  <div className="flex space-x-2 items-center">
                    <IconWrapper>
                      <SquarePen size={15} />{" "}
                    </IconWrapper>
                    <label htmlFor="newList" className="block font-medium">
                      New List
                    </label>
                  </div>
                  <div className="flex items-center px-4 -rotate-90 group-open:rotate-180">
                    <ChevronDown size={18} />
                  </div>
                </summary>
                <div className="w-full text-small mt-3 group-open:animate-fadeIn">
                  <div className="flex flex-col pb-2 pr-3">
                    <div className="flex space-x-2">
                      <input
                        onChange={(e) => setNewList(e.target.value)}
                        value={newList}
                        id="newList"
                        type="text"
                        placeholder="List name"
                        required
                        className="input flex-1"
                      />
                      <DialogClose asChild>
                        <Button
                          variant={newList.length > 2 ? "default" : "outline"}
                          onClick={handleNewList}
                          disabled={newList.length < 2}
                        >
                          Add
                        </Button>
                      </DialogClose>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PlayButton;
