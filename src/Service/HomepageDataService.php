<?php

declare(strict_types=1);

namespace App\Service;

use App\Dto\ProfileDto;
use App\Dto\ProjectDto;
use App\Dto\SkillDto;
use App\Dto\TimelineItemDto;
use Fagathe\CorePhp\File\JsonFileHandler;

final class HomepageDataService
{
    public function __construct(
        private readonly JsonFileHandler $jsonFileHandler,
        private readonly string $projectDir,
    ) {
    }

    public function getSeo(): array|object|null
    {
        return $this->jsonFileHandler->readJson(
            $this->projectDir . '/data/seo.json',
            rootKey: 'homepage',
        );
    }

    public function getProfile(): ?ProfileDto
    {
        return $this->jsonFileHandler->readJsonAs(
            $this->projectDir . '/data/profile.json',
            ProfileDto::class,
        );
    }

    /** @return SkillDto[] */
    public function getSkills(): array
    {
        return $this->jsonFileHandler->readJsonArrayAs(
            $this->projectDir . '/data/skills.json',
            null,
            SkillDto::class,
        );
    }

    /** @return ProjectDto[] */
    public function getProjects(): array
    {
        return $this->jsonFileHandler->readJsonArrayAs(
            $this->projectDir . '/data/projects.json',
            null,
            ProjectDto::class,
        );
    }

    /** @return TimelineItemDto[] */
    public function getTimeline(): array
    {
        return $this->jsonFileHandler->readJsonArrayAs(
            $this->projectDir . '/data/timeline.json',
            null,
            TimelineItemDto::class,
        );
    }
}
