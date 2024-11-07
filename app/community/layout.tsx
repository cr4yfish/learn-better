
import Navigation from "@/components/ui/Navigation";

export default function Layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    return (
        <>
        {children}
        <Navigation activeTitle="Community" />
        </>
    )
}