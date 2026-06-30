<?php

declare(strict_types=1);

namespace App\Service\Mail;

use App\Dto\ContactDto;
use App\Dto\Enum\ContactSubjectEnum;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;

/**
 * Envoie les deux emails déclenchés à la soumission du formulaire de contact :
 *
 *   1. Récapitulatif à l'utilisateur (confirmation de réception)
 *   2. Notification à Frédérick AGATHE (contenu complet du message)
 *
 * Les templates Twig sont dans templates/emails/.
 * Les adresses et le nom d'expéditeur sont injectés depuis les paramètres Symfony
 * (config/services.yaml) pour éviter les valeurs en dur.
 */
final class ContactMailer
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly string $ownerEmail = '',   // %app.owner_email%
        private readonly string $ownerName = '',    // %app.owner_name%
        private readonly string $senderEmail = '',  // %app.sender_email%  (noreply@…)
        private readonly string $senderName = '',   // %app.sender_name%
    ) {}

    /**
     * Envoie les deux emails de manière synchrone.
     * Pour un envoi asynchrone, brancher Messenger sur le transport mailer.
     */
    public function send(ContactDto $dto): void
    {
        $this->sendConfirmationToUser($dto);
        $this->sendNotificationToOwner($dto);
    }

    // ── Email 1 : récapitulatif à l'utilisateur ───────────────────────────────

    private function sendConfirmationToUser(ContactDto $dto): void
    {
        $email = (new TemplatedEmail())
            ->from(new Address($this->senderEmail, $this->senderName))
            ->to(new Address($dto->email, $dto->fullName))
            ->replyTo(new Address($this->ownerEmail, $this->ownerName))
            ->subject('Votre message a bien été reçu — ' . $this->ownerName)
            ->htmlTemplate('emails/contact_confirmation.html.twig')
            ->context([
                'dto'       => $dto,
                'ownerName' => $this->ownerName,
            ]);

        $this->mailer->send($email);
    }

    // ── Email 2 : notification au propriétaire du site ───────────────────────

    private function sendNotificationToOwner(ContactDto $dto): void
    {
        $subjectLabel = ContactSubjectEnum::tryFrom($dto->subject)?->label() ?? 'Non précisé';

        $email = (new TemplatedEmail())
            ->from(new Address($this->senderEmail, $this->senderName))
            ->to(new Address($this->ownerEmail, $this->ownerName))
            ->replyTo(new Address($dto->email, $dto->fullName))
            ->subject('[Portfolio] Nouveau message — ' . $subjectLabel . ' — ' . $dto->fullName)
            ->htmlTemplate('emails/contact_notification.html.twig')
            ->context([
                'dto'         => $dto,
                'subjectLabel' => $subjectLabel,
            ]);

        $this->mailer->send($email);
    }
}
