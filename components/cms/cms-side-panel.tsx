import Link from "next/link";
import type { ReactNode } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  DrawerContent,
  DrawerDescription,
  DrawerEyebrow,
  DrawerHeader,
  DrawerOverlay,
  DrawerPanel,
  DrawerRoot,
  DrawerTitle,
} from "@/components/ui/drawer";

type CmsSidePanelProps = {
  title: string;
  description?: string;
  closeHref: string;
  children: ReactNode;
};

export function CmsSidePanel({ title, description, closeHref, children }: CmsSidePanelProps) {
  return (
    <DrawerRoot>
      <Link href={closeHref} aria-label="Cerrar panel" className="absolute inset-0" />
      <DrawerOverlay />

      <DrawerPanel>
        <DrawerHeader>
          <div className="space-y-2">
            <DrawerEyebrow>Edicion contextual</DrawerEyebrow>
            <div>
              <DrawerTitle>{title}</DrawerTitle>
              {description ? <DrawerDescription>{description}</DrawerDescription> : null}
            </div>
          </div>

          <Link
            href={closeHref}
            className={buttonVariants({ variant: "outline" })}
          >
            Cerrar
          </Link>
        </DrawerHeader>

        <DrawerContent>{children}</DrawerContent>
      </DrawerPanel>
    </DrawerRoot>
  );
}
