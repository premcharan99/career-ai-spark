
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface UserProps {
  name?: string;
  email: string;
  subscription: 'free' | 'lite' | 'pro';
}

const User = ({ name, email, subscription }: UserProps) => {
  const initials = name 
    ? name.split(' ').map(n => n[0]).join('').toUpperCase() 
    : email.substring(0, 2).toUpperCase();

  const badgeColor = {
    free: 'bg-gray-500',
    lite: 'bg-brand-500',
    pro: 'bg-brand-700',
  }[subscription];

  return (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src="" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium leading-none">{name || email}</p>
        <p className="text-xs text-muted-foreground">{email}</p>
        <Badge className={`mt-1 ${badgeColor}`}>
          {subscription.charAt(0).toUpperCase() + subscription.slice(1)}
        </Badge>
      </div>
    </div>
  );
};

export default User;
