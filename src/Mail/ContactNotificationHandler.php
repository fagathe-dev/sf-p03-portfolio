<?php

declare(strict_types=1);

namespace App\Mail;

use App\Dto\ContactDto;
use Fagathe\CorePhp\Mailer\AbstractMailerHandler;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Mime\Address;

/**
 * Notification au propriétaire du site : contenu complet d'un message du formulaire de contact.
 *
 * Destinataire : SUPPORT_EMAIL (paramètre core_php.email.support_email).
 * Expéditeur : celui de core-php par défaut (DEFAULT_EMAIL_SENDER, au nom de APP_NAME).
 * Reply-To : l'auteur du message, pour lui répondre directement depuis la messagerie.
 *
 * @extends AbstractMailerHandler<ContactDto>
 */
final class ContactNotificationHandler extends AbstractMailerHandler
{
    public function __construct(
        #[Autowire(param: 'core_php.email.support_email')]
        private readonly ?string $ownerEmail = null,
    ) {
    }

    protected function getTemplate(): string
    {
        return 'emails/contact_notification.html.twig';
    }

    protected function getSubject(object $dto): string
    {
        return \sprintf('[Portfolio] Nouveau message — %s — %s', $dto->getSubjectLabel(), $dto->fullName);
    }

    protected function getRecipients(object $dto): array
    {
        // Erreur de configuration, pas d'envoi : elle doit rester visible (non interceptée)
        if (!$this->ownerEmail) {
            throw new \LogicException('SUPPORT_EMAIL n\'est pas défini : impossible de livrer les messages de contact.');
        }

        return [new Address($this->ownerEmail)];
    }

    protected function getReplyTo(object $dto): ?Address
    {
        return new Address($dto->email, $dto->fullName);
    }
}
