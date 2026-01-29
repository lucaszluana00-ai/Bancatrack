"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { allSubjects } from '@/lib/data';
import { useQuestionProgress, type AllQuestionProgress, type QuestionProgressStatus } from '@/lib/questions-progress';
import { debounce } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const StatusDisplay: React.FC<{ status: QuestionProgressStatus }> = ({ status }) => {
  if (status === 'completed') {
    return <span title="Concluído">✅</span>;
  }
  return <span title="Em andamento">⏳</span>;
};

export default function QuestoesPage() {
  const { progress, loading, updateQuestionProgress } = useQuestionProgress();
  const [localProgress, setLocalProgress] = useState<AllQuestionProgress | null>(null);
  
  useEffect(() => {
    if (progress) {
      setLocalProgress(progress);
    }
  }, [progress]);
  
  const debouncedUpdate = useCallback(debounce((newProgress: AllQuestionProgress) => {
    if (updateQuestionProgress) {
        updateQuestionProgress(newProgress);
    }
  }, 500), [updateQuestionProgress]);

  const handleChange = (subjectId: string, field: string, value: any) => {
    if (!localProgress) return;
    const newProgress = {
      ...localProgress,
      [subjectId]: {
        ...localProgress[subjectId],
        [field]: value,
      },
    };
    setLocalProgress(newProgress);
    debouncedUpdate(newProgress);
  };
  
  const handleStatusChange = (subjectId: string, status: QuestionProgressStatus) => {
    if (!localProgress) return;
    const newProgress = {
      ...localProgress,
      [subjectId]: {
        ...localProgress[subjectId],
        status: status,
      },
    };
    setLocalProgress(newProgress);
    if (updateQuestionProgress) {
        updateQuestionProgress(newProgress);
    }
  };

  if (loading || !localProgress) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-12 w-full mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Controle de Questões</CardTitle>
          <CardDescription>
            <div className="space-y-2 pt-2">
              <h3 className="font-semibold">COMO USAR ESSA TABELA</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Semana:</strong> número da semana de estudo</li>
                <li><strong>Status:</strong> ⏳ Em andamento | ✅ Concluído</li>
                <li><strong>Questões:</strong> quantidade feita</li>
                <li><strong>% Acertos:</strong> meta mínima 60% (início)</li>
                <li><strong>Observações:</strong> erros recorrentes / pegadinhas</li>
              </ul>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Semana</TableHead>
                  <TableHead className="min-w-[250px]">Matéria</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Questões</TableHead>
                  <TableHead>% Acertos</TableHead>
                  <TableHead className="min-w-[300px]">Observações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allSubjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell>
                      <Input
                        type="text"
                        value={localProgress[subject.id]?.semana || ''}
                        onChange={(e) => handleChange(subject.id, 'semana', e.target.value)}
                        className="w-20"
                        placeholder="Nº"
                      />
                    </TableCell>
                    <TableCell className="font-medium flex items-center gap-2">
                      <subject.Icon className="h-5 w-5 text-primary shrink-0" />
                      <span>{subject.name}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-xl h-8 w-8">
                            <StatusDisplay status={localProgress[subject.id]?.status || 'in_progress'} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleStatusChange(subject.id, 'in_progress')}>
                            <span className="mr-2">⏳</span> Em andamento
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(subject.id, 'completed')}>
                            <span className="mr-2">✅</span> Concluído
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={localProgress[subject.id]?.questionsDone || ''}
                        onChange={(e) => handleChange(subject.id, 'questionsDone', e.target.value)}
                        className="w-24"
                        placeholder="0"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Input
                          type="number"
                          value={localProgress[subject.id]?.accuracy || ''}
                          onChange={(e) => handleChange(subject.id, 'accuracy', e.target.value)}
                          className="w-24"
                          placeholder="0"
                        />
                         <span className="ml-2 font-semibold">%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={localProgress[subject.id]?.observations || ''}
                        onChange={(e) => handleChange(subject.id, 'observations', e.target.value)}
                        placeholder="Erros recorrentes, pegadinhas..."
                        className="min-h-[60px]"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
