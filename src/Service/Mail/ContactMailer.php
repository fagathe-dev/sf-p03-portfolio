<?php

declare(strict_types=1);

namespace App\Service\Mail;

use App\Dto\ContactDto;
use App\Mail\ContactConfirmationHandler;
use App\Mail\ContactNotificationHandler;
use Fagathe\CorePhp\Mailer\Exception\MailerExceptionInterface;

/**
 * Orchestre les deux e-mails du formulaire de contact, envoyés par le mailer de
 * core-php (AbstractMailerHandler : validation, contrôle des destinataires, logs) :
 *
 *   1. ContactNotificationHandler : notification au propriétaire (contenu complet)
 *   2. ContactConfirmationHandler : accusé de réception à l'auteur du message
 *
 * Les templates sont dans templates/emails/ et étendent @CorePhp/layout.html.twig.
 */
final class ContactMailer
{
    public function __construct(
        private readonly ContactNotificationHandler $notification,
        private readonly ContactConfirmationHandler $confirmation,
    ) {
    }

    /**
     * Envoie les deux e-mails de manière synchrone.
     *
     * @throws MailerExceptionInterface Si la notification au propriétaire échoue : le message
     *                                  n'est pas parvenu, l'appelant doit le signaler
     */
    public function send(ContactDto $dto): void
    {
        // 1. La notification d'abord : c'est le message lui-même. Si elle échoue,
        //    l'exception remonte et l'auteur ne reçoit pas de faux accusé de réception.
        $this->notification->send($dto);

        // 2. L'accusé de réception ensuite. Son échec (boîte pleine, domaine injoignable…)
        //    n'est pas bloquant : le message est déjà arrivé, et une erreur inciterait
        //    l'auteur à le renvoyer en double. core-php a déjà journalisé l'échec.
        try {
            $this->confirmation->send($dto);
        } catch (MailerExceptionInterface) {
        }
    }
}
