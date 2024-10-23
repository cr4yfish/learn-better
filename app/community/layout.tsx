
import Navigation from "@/components/utils/Navigation";

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