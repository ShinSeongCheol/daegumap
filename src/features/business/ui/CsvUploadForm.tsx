'use client'

import {Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Field, FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {parseCsv, uploadBusinessChunk} from "@/src/features/business/actions";
import {SyntheticEvent, useState, useTransition} from "react";
import {Progress, ProgressLabel, ProgressValue} from "@/components/ui/progress";

export function CsvUploadForm() {

    const [isPending, startTransition] = useTransition();
    const [progressValue, setProgressValue] = useState<number>(0);

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(async () => {
            const formData = new FormData(e.currentTarget);

            const commercialAreas = await parseCsv(formData);
            const totalCount = commercialAreas.length;

            const chunkSize = 100;
            let processedCount = 0;
            for (let i=0; i<totalCount; i+=chunkSize) {
                const chunk = commercialAreas.slice(i,i + chunkSize);
                await uploadBusinessChunk(chunk);

                processedCount = processedCount + chunk.length;
                setProgressValue((processedCount / totalCount) * 100);
            }
            setProgressValue(0);
        })
    }

    return (
        <Dialog disablePointerDismissal={true}>
            <DialogTrigger render={<Button variant={'outline'}>업로드</Button>}></DialogTrigger>
            <DialogContent>

                    <form onSubmit={handleSubmit} className={'flex flex-col gap-4'}>
                        <DialogTitle>상권 정보 업로드</DialogTitle>
                        {!isPending ?
                            <>
                            <FieldSet>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor={'file'}>상권정보 파일</FieldLabel>
                                        <Input id={'file'} name={'file'} type={'file'}></Input>
                                    </Field>
                                </FieldGroup>
                            </FieldSet>
                            <DialogFooter>
                                <DialogClose render={<Button variant={'outline'} type={'button'}>취소</Button>}></DialogClose>
                                <Button type={'submit'}>저장</Button>
                            </DialogFooter>
                            </>
                        :
                            <Progress value={progressValue}>
                                <ProgressLabel>업로드중</ProgressLabel>
                                <ProgressValue />
                            </Progress>
                        }
                </form>
            </DialogContent>
        </Dialog>
    )
}