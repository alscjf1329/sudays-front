import { Card, CardHeader, CardSubTitle, CardTitle } from "../common/default";

const CardPopUp: React.FC<{ 
    children: React.ReactNode;
    title: string;
    subtitle?: React.ReactNode;
  }> = ({ children, title, subtitle}) => {
    return (
        <Card className="w-full backdrop-blur-lg bg-[var(--background-secondary)]/80 border-[var(--border)] shadow-lg rounded-2xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-center text-[var(--foreground)]">{title}</CardTitle>
            <CardSubTitle className="text-center text-[var(--foreground)]">{subtitle}</CardSubTitle>
          </div>
          {children}
        </CardHeader>
      </Card>
    );
  };
  
  export default CardPopUp;