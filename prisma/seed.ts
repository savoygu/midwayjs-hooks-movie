import { prisma } from '../src/api/prisma';

async function seed() {
  await prisma.user.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.category.deleteMany();

  const u1 = await prisma.user.create({
    data: {
      name: 'gusaifei',
      password: '123456',
      role: 100,
    },
  });
  // const u2 = await prisma.user.create({});
  const c1 = await prisma.category.create({
    data: {
      name: '科幻',
    },
  });

  const m1 = await prisma.movie.create({
    data: {
      title: '流浪地球2',
      summary:
        '太阳即将毁灭，人类在地球表面建造出巨大的推进器，寻找新的家园。然而宇宙之路危机四伏，为了拯救地球，流浪地球时代的年轻人再次挺身而出，展开争分夺秒的生死之战。',
      poster:
        'https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2885955777.webp',
      doctor: '郭帆',
      year: 2023,
      country: '中国大陆',
      language: '汉语普通话',
      categoryId: c1.id,
    },
  });

  const m2 = await prisma.movie.create({
    data: {
      title: '流浪地球',
      summary:
        '近未来，科学家们发现太阳急速衰老膨胀，短时间内包括地球在内的整个太阳系都将被太阳所吞没。为了自救，人类提出一个名为“流浪地球”的大胆计划，即倾全球之力在地球表面建造上万座发动机和转向发动机，推动地球离开太阳系，用2500年的时间奔往另外一个栖息之地。中国航天员刘培强（吴京 饰）在儿子刘启四岁那年前往国际空间站，和国际同侪肩负起领航者的重任。转眼刘启（屈楚萧 饰）长大，他带着妹妹朵朵（赵今麦 饰）偷偷跑到地表，偷开外公韩子昂（吴孟达 饰）的运输车，结果不仅遭到逮捕，还遭遇了全球发动机停摆的事件。为了修好发动机，阻止地球坠入木星，全球开始展开饱和式营救，连刘启他们的车也被强征加入。在与时间赛跑的过程中，无数的人前仆后继，奋不顾身，只为延续百代子孙生存的希望……',
      poster:
        'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2545472803.webp',
      doctor: '郭帆',
      year: 2019,
      country: '中国大陆',
      language: '汉语普通话',
      categoryId: c1.id,
    },
  });

  const t1 = await prisma.comment.create({
    data: {
      content:
        '从各个方面来说都是一部好看的类型片。而最特别的是它是一部国产科幻电影，影迷+科幻迷的双重满足。和最好的好莱坞视效电影相比肯定有差距，但差距已经是肉眼可见的了，剩下的都是假以时日就有机会追上的。追求最广泛的情感共鸣是所有商业类型片都要努力做到的，在某些人看来很俗，但我觉得这一点反而应该是值得骄傲的。',
      userId: u1.id,
      movieId: m2.id,
    },
  });

  const t2 = await prisma.comment.create({
    data: {
      content:
        '“北京道路安全委提醒你：道路千万条，安全第一条，行车不规范，亲人两行泪” 这句广播语真是又土又洗脑，能不能押点韵啊？哈哈哈~ 电影比预期要更恢弘磅礴，晨昏线过后的永夜、火种计划、让地球流浪、木星推动地球…等等大小设定，没想到中国也能拍这么大架构、大格局的科幻片了，而且是第一部，了不得。以前看国外科幻感觉离我们很远，这一次看到熟悉的北京大裤衩、上海东方明珠都变成零下89°冰天冻地的末世场景，既猎奇又唏嘘。虽然在剧情上有套路，对于这部中国文化背景下的科幻新生儿，鼓励多于挑剔。导演说美国人拍科幻是放弃地球、去挖掘新的人类居住地，而中国人是不放弃地球、守住家土的情怀…“希望是我们回家的唯一方向”',
      userId: u1.id,
      movieId: m2.id,
    },
  });

  const t3 = await prisma.comment.create({
    data: {
      content: '支持！！！',
      userId: u1.id,
      movieId: m2.id,
      parentId: t1.id,
    },
  });
}

seed();
