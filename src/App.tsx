import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { isEmpty } from 'lodash';
import {
  Button,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react';
import RHFInput from './RHF/RHFInput';
import FormChienDichCon from './components/FormChienDichCon';

const schema = z.object({
  campaign: z.object({
    information: z.object({
      name: z.string().trim().min(1, 'Dữ liệu không hợp lệ'),
      describe: z.string().trim().optional(),
    }),
    subCampaigns: z
      .array(
        z.object({
          name: z.string().trim().min(1, 'Dữ liệu không hợp lệ'),
          status: z.boolean(),
          ads: z
            .array(
              z.object({
                name: z.string().trim().min(1, 'Dữ liệu không hợp lệ'),
                quantity: z
                  .number()
                  .or(z.string().trim().regex(/\d+/).transform(Number))
                  .refine((n) => n > 0),
              }),
            )
            .min(1),
        }),
      )
      .min(1),
  }),
});

export type FormValues = z.infer<typeof schema>;

function App() {
  const myForm = useForm<FormValues>({
    mode: 'all',
    resolver: zodResolver(schema),
    defaultValues: {
      campaign: {
        information: {
          name: '',
          describe: undefined,
        },
        subCampaigns: [
          {
            name: 'Chiến dịch con 1',
            status: true,
            ads: [
              {
                name: 'Quảng cáo 1',
                quantity: 0,
              },
            ],
          },
        ],
      },
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = myForm;

  const onSubmit = handleSubmit((data) => {
    console.log('onSubmit data:', data);
    alert(JSON.stringify(data));
  });

  useEffect(() => {
    if (isSubmitting) {
      if (!isEmpty(errors)) {
        alert('Vui lòng điền đúng và đầy đủ thông tin');
      }
    }
  }, [isSubmitting, errors]);

  return (
    <div className="flex h-screen w-screen flex-1 flex-col">
      <form onSubmit={onSubmit} className="flex flex-col divide-y">
        <div className="flex flex-1 items-center justify-end p-4">
          <Button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-6 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
          >
            Submit
          </Button>
        </div>
        <div className="flex flex-1 p-5">
          <TabGroup className="flex flex-1 flex-col rounded-lg bg-gray-100 p-5">
            <TabList>
              <Tab className="rounded-full px-3 py-1 text-sm/6 font-semibold focus:outline-none data-[hover]:bg-black/5 data-[selected]:bg-black/10 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-black">
                Thông tin
              </Tab>
              <Tab className="rounded-full px-3 py-1 text-sm/6 font-semibold focus:outline-none data-[hover]:bg-black/5 data-[selected]:bg-black/10 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-black">
                Chiến dịch con
              </Tab>
            </TabList>
            <TabPanels className="flex flex-1 py-4">
              <TabPanel className="w-full space-y-6 rounded-xl bg-black/5 p-3">
                <RHFInput
                  label="Tên chiến dịch *"
                  {...register('campaign.information.name')}
                  helperText={errors.campaign?.information?.name?.message}
                />
                <RHFInput
                  label="Mô tả"
                  {...register('campaign.information.describe')}
                  helperText={errors.campaign?.information?.describe?.message}
                />
              </TabPanel>
              <TabPanel className="flex w-full flex-col gap-y-4 rounded-xl bg-black/5 p-3">
                <FormChienDichCon myForm={myForm} />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </form>
    </div>
  );
}

export default App;
