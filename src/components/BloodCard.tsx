import { BloodCard as BloodCardType, CardStatus } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import { formatIndianDate, maskAadhar, formatIndianPhone } from '@/utils/indiaData';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Droplet, Calendar, Phone, Mail, User, Shield, Activity } from 'lucide-react';

interface BloodCardProps {
  card: BloodCardType;
  className?: string;
}

const getStatusColor = (status: CardStatus) => {
  switch (status) {
    case 'active':
      return 'bg-success/10 text-success border-success';
    case 'expired':
      return 'bg-destructive/10 text-destructive border-destructive';
    case 'pending':
      return 'bg-warning/10 text-warning border-warning';
    case 'suspended':
      return 'bg-muted text-muted-foreground border-muted';
    default:
      return 'bg-muted text-muted-foreground border-muted';
  }
};

export const BloodCard = ({ card, className = '' }: BloodCardProps) => {
  const fullName = `${card.firstName || ''} ${card.lastName || ''}`.trim();
  const qrData = JSON.stringify({
    id: card.id,
    userId: card.userId,
    cardNumber: card.cardNumber,
    bloodType: card.bloodType,
    name: fullName,
    phone: card.phoneNumber,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative w-full max-w-md mx-auto ${className}`}
      id="blood-card"
    >
      {/* Card Container */}
      <div className="relative bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/20 rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="relative bg-primary/10 backdrop-blur-sm p-6 border-b border-primary/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center ring-4 ring-background shadow-lg">
                  {card.avatar ? (
                    <img
                      src={card.avatar}
                      alt={fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-primary-foreground" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-background rounded-full flex items-center justify-center shadow-md">
                  <Shield className="w-4 h-4 text-success" />
                </div>
              </div>

              {/* Name & Role */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground">{fullName}</h3>
                <p className="text-sm text-muted-foreground">
                  {card.role === 'donor' ? 'Verified Donor' : 'Recipient'}
                </p>
                <Badge variant="outline" className={`mt-1 text-xs ${getStatusColor(card.status)}`}>
                  {card.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Blood Type Badge */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-destructive/90 flex items-center justify-center shadow-lg ring-4 ring-background">
                <span className="text-2xl font-bold text-destructive-foreground">
                  {card.bloodType}
                </span>
              </div>
              <Droplet className="w-4 h-4 text-destructive mt-1" />
            </div>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-6 space-y-4">
          {/* Card Number */}
          <div className="text-center pb-4 border-b border-border/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Digital Blood Card
            </p>
            <p className="text-lg font-mono font-semibold text-foreground">
              {card.cardNumber}
            </p>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              icon={<Calendar className="w-4 h-4" />}
              label="Date of Birth"
              value={formatIndianDate(card.dateOfBirth)}
            />
            <DetailItem
              icon={<User className="w-4 h-4" />}
              label="Gender"
              value={card.gender.charAt(0).toUpperCase() + card.gender.slice(1)}
            />
            <DetailItem
              icon={<Phone className="w-4 h-4" />}
              label="Phone"
              value={formatIndianPhone(card.phoneNumber)}
            />
            <DetailItem
              icon={<Mail className="w-4 h-4" />}
              label="Email"
              value={card.email}
              className="col-span-2"
            />
            {card.aadharNumber && (
              <DetailItem
                icon={<Shield className="w-4 h-4" />}
                label="Aadhar"
                value={maskAadhar(card.aadharNumber)}
                className="col-span-2"
              />
            )}
            {card.lastDonationDate && (
              <DetailItem
                icon={<Activity className="w-4 h-4" />}
                label="Last Donation"
                value={formatIndianDate(card.lastDonationDate)}
                className="col-span-2"
              />
            )}
          </div>

          {/* Health Info */}
          {card.healthInfo && (
            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Health Information
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {card.healthInfo.hemoglobinLevel && (
                  <div>
                    <span className="text-muted-foreground">HB Level: </span>
                    <span className="font-medium">{card.healthInfo.hemoglobinLevel} g/dL</span>
                  </div>
                )}
                {card.healthInfo.weight && (
                  <div>
                    <span className="text-muted-foreground">Weight: </span>
                    <span className="font-medium">{card.healthInfo.weight} kg</span>
                  </div>
                )}
                {card.healthInfo.bloodPressure && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">BP: </span>
                    <span className="font-medium">{card.healthInfo.bloodPressure}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QR Code & Validity */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Issued</p>
              <p className="text-sm font-medium">{formatIndianDate(card.issueDate)}</p>
              <p className="text-xs text-muted-foreground mt-2">Valid Until</p>
              <p className="text-sm font-medium">{formatIndianDate(card.expiryDate)}</p>
            </div>
            
            <div className="bg-background p-3 rounded-lg shadow-inner">
              <QRCodeSVG value={qrData} size={100} level="H" includeMargin={false} />
              <p className="text-xs text-center text-muted-foreground mt-2">Scan for Details</p>
            </div>
          </div>

          {/* Digital Signature */}
          <div className="text-center text-xs text-muted-foreground italic pt-2 border-t border-border/50">
            Digital Signature: {card.digitalSignature.slice(0, 16)}...
          </div>
        </div>

        {/* Decorative Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-destructive/5 rounded-full translate-y-12 -translate-x-12" />
      </div>
    </motion.div>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}

const DetailItem = ({ icon, label, value, className = '' }: DetailItemProps) => (
  <div className={`flex items-start gap-2 ${className}`}>
    <div className="text-primary mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground truncate" title={value}>
        {value}
      </p>
    </div>
  </div>
);
